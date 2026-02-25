import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeals, deleteDeal } from "./dealSlice";
import { useDebounce } from "../../hooks/useDebounce";
import {
  STAGE_COLORS,
  DEAL_STAGES,
  formatDate,
  formatLabel,
} from "../../constants";

import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import DeleteConfirm from "../../components/DeleteConfirm";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";

import toast from "react-hot-toast";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const DealList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deals, pagination, loading } = useSelector((s) => s.deals);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [stageFilter, setStageFilter] = useState("");

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });

  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(
      fetchDeals({
        page,
        limit: 10,
        search: debouncedSearch,
        stage: stageFilter || undefined,
      })
    );
  }, [dispatch, page, debouncedSearch, stageFilter]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteDeal(deleteModal.id)).unwrap();
      toast.success("Deal deleted");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Deals"
        subtitle={`${pagination?.total || 0} total deals`}
      >
        <button
          onClick={() => navigate("/deals/new")}
          className="btn-primary"
        >
          <PlusIcon className="w-5 h-5 mr-1.5" />
          New Deal
        </button>
      </PageHeader>

      <SearchBar
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        placeholder="Search deals..."
      >
        <select
          value={stageFilter}
          onChange={(e) => {
            setStageFilter(e.target.value);
            setPage(1);
          }}
          className="select-field w-full sm:w-56"
        >
          <option value="">All Stages</option>
          {DEAL_STAGES.map((s) => (
            <option key={s} value={s}>
              {formatLabel(s)}
            </option>
          ))}
        </select>
      </SearchBar>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <Spinner className="py-20" />
        ) : deals.length === 0 ? (
          <EmptyState title="No deals found" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Deal Log ID",
                      "Logged On",
                      "Deal Name",
                      "Account Name",
                      "Product Group",
                      "Stage",
                      "Person In Charge",
                      "Weightage",
                      "Closing Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`table-header ${
                          h === "Actions" ? "text-right" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {deals.map((d) => (
                    <tr
                      key={d.id}
                      className="hover:bg-gray-50/50 transition"
                    >
                      {/* Deal Log ID */}
                      <td className="table-cell font-medium">
                        {d.dealLogId}
                      </td>

                      {/* Logged On */}
                      <td className="table-cell text-gray-600">
                        {formatDate(d.createdAt)}
                      </td>

                      {/* Deal Name */}
                      <td className="table-cell">
                        <Link to={`/deals/${d.id}`} className="link">
                          {d.dealName}
                        </Link>
                      </td>

                      {/* Account */}
                      <td className="table-cell">
                        {d.account?.accountName || "—"}
                      </td>

                      {/* Product Group */}
                      <td className="table-cell">
                        {d.productGroup || "—"}
                      </td>

                      {/* Stage */}
                      <td className="table-cell">
                        <span
                          className={`badge ${
                            STAGE_COLORS[d.stage] || "badge-gray"
                          }`}
                        >
                          {formatLabel(d.stage)}
                        </span>
                      </td>

                      {/* Person in Charge */}
                      <td className="table-cell">
                        {d.personInCharge || "—"}
                      </td>

                      {/* Weightage */}
                      <td className="table-cell">
                        {d.weightage
                          ? formatLabel(d.weightage)
                          : "—"}
                      </td>

                      {/* Closing Date */}
                      <td className="table-cell text-gray-600">
                        {formatDate(d.closingDate)}
                      </td>

                      {/* Actions */}
                      <td className="table-cell">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => navigate(`/deals/${d.id}`)}
                            className="action-btn text-blue-600"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/deals/${d.id}/edit`)
                            }
                            className="action-btn text-amber-600"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                id: d.id,
                                name: d.dealName,
                              })
                            }
                            className="action-btn text-red-600"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination?.pages > 1 && (
              <div className="border-t px-6 py-4">
                <Pagination
                  pagination={pagination}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <DeleteConfirm
        open={deleteModal.open}
        onClose={() =>
          setDeleteModal({ open: false, id: null, name: "" })
        }
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Deal"
        message={`Delete "${deleteModal.name}"? This cannot be undone.`}
      />
    </div>
  );
};

export default DealList;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchAccounts, deleteAccount } from "./accountSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { formatCurrency, RATING_COLORS } from "../../constants";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import DeleteConfirm from "../../components/DeleteConfirm";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import toast from "react-hot-toast";
import {
  PlusIcon,
  BuildingOffice2Icon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const AccountList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accounts, pagination, loading } = useSelector(
    (s) => s.accounts
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(
      fetchAccounts({ page, limit: 10, search: debouncedSearch })
    );
  }, [dispatch, page, debouncedSearch]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteAccount(deleteModal.id)).unwrap();
      toast.success("Account deleted successfully");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
  <div className="space-y-6">

    {/* HEADER */}
    <PageHeader
      title="Accounts"
      subtitle={`${pagination?.total || 0} total accounts`}
    >
      <button
        onClick={() => navigate("/accounts/new")}
        className="inline-flex items-center px-4 py-2.5 rounded-xl
        bg-gradient-to-r from-blue-600 to-indigo-600
        text-white text-sm font-medium shadow hover:shadow-lg
        transition-all"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        New Account
      </button>
    </PageHeader>

    <SearchBar
      value={search}
      onChange={(val) => {
        setSearch(val);
        setPage(1);
      }}
      placeholder="Search accounts by name, phone, or account number..."
    />

    {/* CARD */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      {loading ? (
        <Spinner className="py-24" />
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={BuildingOffice2Icon}
          title="No accounts found"
          description="Get started by creating your first account."
          action={
            <button
              onClick={() => navigate("/accounts/new")}
              className="btn-primary"
            >
              <PlusIcon className="w-5 h-5 mr-1.5" />
              Create Account
            </button>
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto">

            <table className="min-w-full text-sm">

              {/* TABLE HEAD */}
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-gray-500 uppercase text-xs tracking-wider">
                  <th className="px-6 py-4 text-left">Account</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Industry</th>
                  <th className="px-6 py-4 text-left">Rating</th>
                  <th className="px-6 py-4 text-left">Owner</th>
                  <th className="px-6 py-4 text-center">Contacts</th>
                  <th className="px-6 py-4 text-center">Deals</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y">

                {accounts.map((account, i) => (
                  <tr
                    key={account.id}
                    className={`group transition
                    ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}
                    hover:bg-blue-50/40`}
                  >

                    {/* NAME */}
                    <td className="px-6 py-4">
                      <Link
                        to={`/accounts/${account.id}`}
                        className="font-semibold text-gray-800 hover:text-blue-600"
                      >
                        {account.accountName}
                      </Link>

                      {account.accountNumber && (
                        <p className="text-xs text-gray-400 mt-1">
                          #{account.accountNumber}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {account.phone || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {account.industry || "—"}
                    </td>

                    {/* RATING */}
                    <td className="px-6 py-4">
                      {account.rating ? (
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full
                          ${RATING_COLORS[account.rating] || "bg-gray-100 text-gray-600"}`}
                        >
                          {account.rating}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {account.owner?.name || "—"}
                    </td>

                    {/* CONTACT COUNT */}
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold
                      bg-blue-100 text-blue-700">
                        {account._count?.contacts || 0}
                      </span>
                    </td>

                    {/* DEAL COUNT */}
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold
                      bg-emerald-100 text-emerald-700">
                        {account._count?.deals || 0}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end opacity-70 group-hover:opacity-100 transition">

                        <div className="flex bg-gray-100 rounded-xl p-1 shadow-sm">

                          <button
                            onClick={() => navigate(`/accounts/${account.id}`)}
                            className="action-btn hover:text-blue-600"
                          >
                            <EyeIcon className="w-4.5 h-4.5" />
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/accounts/${account.id}/edit`)
                            }
                            className="action-btn hover:text-amber-600"
                          >
                            <PencilSquareIcon className="w-4.5 h-4.5" />
                          </button>

                          <button
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                id: account.id,
                                name: account.accountName,
                              })
                            }
                            className="action-btn hover:text-red-600"
                          >
                            <TrashIcon className="w-4.5 h-4.5" />
                          </button>

                        </div>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {pagination && pagination.pages > 1 && (
            <div className="border-t bg-gray-50 px-6 py-4">
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
      title="Delete Account"
      message={`Are you sure you want to delete "${deleteModal.name}"? All associated contacts and deals will also be deleted. This action cannot be undone.`}
    />
  </div>
);
};

export default AccountList;
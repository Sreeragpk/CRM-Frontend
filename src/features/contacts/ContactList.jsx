

// src/features/contacts/ContactList.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchContacts, deleteContact } from "./contactSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { formatLabel } from "../../constants";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import DeleteConfirm from "../../components/DeleteConfirm";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import Avatar from "../../components/Avatar";
import toast from "react-hot-toast";
import { getPriorityColor } from "../../utils/priorityColor";
import {
  PlusIcon,
  UserIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const ContactList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contacts, pagination, loading } = useSelector((s) => s.contacts);

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
    dispatch(fetchContacts({ page, limit: 10, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteContact(deleteModal.id)).unwrap();
      toast.success("Contact deleted successfully");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

 return (
  <div className="space-y-6">
    <PageHeader
      title="Contacts"
      subtitle={`${pagination?.total || 0} total contacts`}
    >
      <button
        onClick={() => navigate("/contacts/new")}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 transition"
      >
        <PlusIcon className="w-5 h-5" />
        New Contact
      </button>
    </PageHeader>

    <SearchBar
      value={search}
      onChange={(val) => {
        setSearch(val);
        setPage(1);
      }}
      placeholder="Search contacts..."
    />

    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {loading ? (
        <Spinner className="py-24" />
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={UserIcon}
          title="No contacts found"
          description="Create your first contact to get started."
        />
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-gray-600">
                  <th className="table-header text-center">Task</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Phone</th>
                  <th className="table-header">Account</th>
                  <th className="table-header">Source</th>
                  <th className="table-header text-center">Deals</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {contacts.map((contact, i) => (
                  <tr
                    key={contact.id}
                    className="group hover:bg-indigo-50/40 transition"
                  >
                    {/* TASK */}
                    <td className="table-cell text-center">
                      {contact.upcomingTask ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${getPriorityColor(
                            contact.upcomingTask.priority
                          )}`}
                        >
                          {formatDate(contact.upcomingTask.dueDate)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* NAME */}
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={contact.firstName}
                          secondName={contact.lastName}
                          size="sm"
                          image={contact.image}
                        />
                        <Link
                          to={`/contacts/${contact.id}`}
                          className="font-semibold text-gray-800 hover:text-indigo-600"
                        >
                          {contact.firstName} {contact.lastName}
                        </Link>
                      </div>
                    </td>

                    <td className="table-cell text-gray-500">
                      {contact.email}
                    </td>

                    <td className="table-cell text-gray-500">
                      {contact.phone || "—"}
                    </td>

                    <td className="table-cell">
                      <Link
                        to={`/accounts/${contact.account?.id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {contact.account?.accountName || "—"}
                      </Link>
                    </td>

                    <td className="table-cell text-gray-500">
                      {contact.leadSource
                        ? formatLabel(contact.leadSource)
                        : "—"}
                    </td>

                    <td className="table-cell text-center">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {contact._count?.deals || 0}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="table-cell">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() =>
                            navigate(`/contacts/${contact.id}`)
                          }
                          className="icon-btn hover:text-indigo-600"
                        >
                          <EyeIcon className="w-4.5 h-4.5" />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/contacts/${contact.id}/edit`)
                          }
                          className="icon-btn hover:text-amber-500"
                        >
                          <PencilSquareIcon className="w-4.5 h-4.5" />
                        </button>

                        <button
                          onClick={() =>
                            setDeleteModal({
                              open: true,
                              id: contact.id,
                              name: `${contact.firstName} ${contact.lastName}`,
                            })
                          }
                          className="icon-btn hover:text-rose-600"
                        >
                          <TrashIcon className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 MOBILE CARD VIEW */}
          <div className="lg:hidden divide-y">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={contact.firstName}
                    secondName={contact.lastName}
                    size="sm"
                    image={contact.image}
                  />
                  <div className="font-semibold">
                    {contact.firstName} {contact.lastName}
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  {contact.email || "—"}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Deals: {contact._count?.deals || 0}
                  </span>

                  <div className="flex gap-3">
                    <EyeIcon
                      onClick={() =>
                        navigate(`/contacts/${contact.id}`)
                      }
                      className="w-5 text-indigo-600"
                    />
                    <PencilSquareIcon
                      onClick={() =>
                        navigate(`/contacts/${contact.id}/edit`)
                      }
                      className="w-5 text-amber-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination?.pages > 1 && (
            <div className="border-t bg-gray-50 px-6 py-4">
              <Pagination pagination={pagination} onPageChange={setPage} />
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
    />
  </div>
);}

export default ContactList;
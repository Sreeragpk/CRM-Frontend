import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask } from "./taskSlice";
import { useNavigate } from "react-router-dom";
import { getPriorityColor } from "../../utils/priorityColor";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700 border-green-200";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "DEFERRED":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "WAITING":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const TaskList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tasks, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await dispatch(deleteTask(id)).unwrap();
      toast.success("Task deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading tasks...
      </div>
    );

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Tasks</h1>

        <button
          onClick={() => navigate("/tasks/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Create Task
        </button>
      </div>

      {/* EMPTY STATE */}
      {tasks.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
          No tasks found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Subject</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Account</th>
                <th>Contact</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="border-t hover:bg-gray-50 cursor-pointer group transition"
                >
                  {/* SUBJECT */}
                  <td className="p-3 font-medium text-gray-800">
                    {task.subject}
                  </td>

                  {/* DUE DATE */}
                  <td>
                    {task.dueDate
                      ? dayjs(task.dueDate).format("DD MMM YYYY")
                      : "—"}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </td>

                  {/* PRIORITY */}
                  <td className="text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority.replace("_", " ")}
                    </span>
                  </td>

                  {/* ACCOUNT */}
                  <td>{task.account?.accountName || "—"}</td>

                  {/* CONTACT */}
                  <td>
                    {task.contact
                      ? `${task.contact.firstName} ${task.contact.lastName || ""}`
                      : "—"}
                  </td>

                  {/* ACTIONS */}
                  <td
                    className="pr-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() =>
                          navigate(`/tasks/${task.id}/edit`)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-600 hover:text-red-800"
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
      )}
    </div>
  );
};

export default TaskList;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createTask,
  updateTask,
  getTask,
  clearTask,
} from "./taskSlice";
import { fetchContacts } from "../contacts/contactSlice";
import ContactLookupModal from "./ContactLookupModal";

const TaskForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contacts } = useSelector((s) => s.contacts);
  const { task, loading } = useSelector((s) => s.tasks);

  const [showContactModal, setShowContactModal] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    dueDate: "",
    status: "NOT_STARTED",
    priority: "NORMAL",
    contactId: "",
    accountId: "",
    description: "",
  });

  const [contactName, setContactName] = useState("");
  const [accountName, setAccountName] = useState("");

  /* ---------------- REMINDER ---------------- */

  const [reminderOn, setReminderOn] = useState(false);
  const [reminder, setReminder] = useState({
    date: "",
    time: "",
    notify: "EMAIL",
  });

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    dispatch(fetchContacts({ page: 1, limit: 100 }));

    if (isEdit) dispatch(getTask(id));

    return () => dispatch(clearTask());
  }, [id]);

  /* ---------------- PREFILL EDIT ---------------- */

  useEffect(() => {
    if (!task || !isEdit) return;

    setForm({
      subject: task.subject,
      dueDate: task.dueDate?.slice(0, 10),
      status: task.status,
      priority: task.priority,
      contactId: task.contactId || "",
      accountId: task.accountId || "",
      description: task.description || "",
    });

    if (task.contact) {
      setContactName(
        `${task.contact.firstName} ${task.contact.lastName || ""}`
      );
    }

    if (task.account) {
      setAccountName(task.account.accountName);
    }

    /* PREFILL REMINDER */
    if (task.reminders?.length) {
      const r = task.reminders[0];

      setReminderOn(true);

      const d = new Date(r.remindAt);

      setReminder({
        date: d.toISOString().slice(0, 10),
        time: d.toTimeString().slice(0, 5),
        notify:
          r.emailBefore !== null && r.popupBefore !== null
            ? "BOTH"
            : r.emailBefore !== null
            ? "EMAIL"
            : "POPUP",
      });
    }
  }, [task]);

  /* ---------------- CONTACT SELECT ---------------- */

  const handleContactSelect = (contact) => {
    setForm((p) => ({
      ...p,
      contactId: contact.id,
      accountId: contact.account?.id || "",
    }));

    setContactName(`${contact.firstName} ${contact.lastName || ""}`);
    setAccountName(contact.account?.accountName || "");
    setShowContactModal(false);
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = { ...form };

    if (reminderOn && reminder.date && reminder.time) {
      const remindAt = new Date(`${reminder.date}T${reminder.time}`);

      payload.reminder = {
        remindAt,
        emailBefore:
          reminder.notify === "EMAIL" || reminder.notify === "BOTH"
            ? 0
            : null,
        popupBefore:
          reminder.notify === "POPUP" || reminder.notify === "BOTH"
            ? 0
            : null,
      };
    }

    if (isEdit) {
      await dispatch(updateTask({ id, formData: payload }));
    } else {
      await dispatch(createTask(payload));
    }

    navigate("/tasks");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-semibold mb-6">
        {isEdit ? "Edit Task" : "Create Task"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* LEFT COLUMN */}
        <div className="space-y-5 bg-white p-6 rounded-xl border">

          <input
            className="input"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
            required
          />

          <input
            type="date"
            className="input"
            value={form.dueDate}
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
          />

          <div
            onClick={() => setShowContactModal(true)}
            className="input cursor-pointer"
          >
            {contactName || "Select Contact"}
          </div>

          <div className="input bg-gray-100">
            {accountName || "Account auto-fills"}
          </div>

          <textarea
            rows={4}
            className="input"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5 bg-white p-6 rounded-xl border">

          <select
            className="input"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            className="input"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>

          {/* REMINDER */}
          <div className="flex justify-between items-center">
            <label className="font-medium">Reminder</label>
            <input
              type="checkbox"
              checked={reminderOn}
              onChange={() => setReminderOn(!reminderOn)}
            />
          </div>

          {reminderOn && (
            <div className="border rounded-lg p-4 space-y-3 bg-gray-50">

              <div className="flex gap-2">
                <input
                  type="date"
                  className="input"
                  value={reminder.date}
                  onChange={(e) =>
                    setReminder({ ...reminder, date: e.target.value })
                  }
                />

                <input
                  type="time"
                  className="input"
                  value={reminder.time}
                  onChange={(e) =>
                    setReminder({ ...reminder, time: e.target.value })
                  }
                />
              </div>

              <select
                className="input"
                value={reminder.notify}
                onChange={(e) =>
                  setReminder({ ...reminder, notify: e.target.value })
                }
              >
                <option value="EMAIL">Email</option>
                <option value="POPUP">Pop Up</option>
                <option value="BOTH">Both</option>
              </select>
            </div>
          )}

        </div>

        {/* ACTION BAR */}
        <div className="md:col-span-2 flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/tasks")}
          >
            Cancel
          </button>

          <button className="btn-primary" disabled={loading}>
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Task"
              : "Create Task"}
          </button>
        </div>
      </form>

      <ContactLookupModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        contacts={contacts}
        onSelect={handleContactSelect}
      />
    </div>
  );
};

export default TaskForm;
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   createTask,
//   updateTask,
//   getTask,
//   clearTask,
// } from "./taskSlice";
// import { fetchContacts } from "../contacts/contactSlice";
// import ContactLookupModal from "./ContactLookupModal";
// import SubjectWithSuggestions from "./SubjectWithSuggestions";

// const TaskForm = () => {
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { contacts } = useSelector((s) => s.contacts);
//   const { task, loading } = useSelector((s) => s.tasks);

//   const [showContactModal, setShowContactModal] = useState(false);

//   const [form, setForm] = useState({
//     subject: "",
//     dueDate: "",
//     status: "NOT_STARTED",
//     priority: "HIGH",
//     contactId: "",
//     accountId: "",
//     description: "",
//   });

//   const [contactName, setContactName] = useState("");
//   const [accountName, setAccountName] = useState("");

//   /* ---------------- REMINDER ---------------- */

//   const [reminderOn, setReminderOn] = useState(false);
//   const [reminder, setReminder] = useState({
//     date: "",
//     time: "",
//     notify: "EMAIL",
//   });

//   /* ---------------- LOAD ---------------- */

//   useEffect(() => {
//     dispatch(fetchContacts({ page: 1, limit: 100 }));

//     if (isEdit) dispatch(getTask(id));

//     return () => dispatch(clearTask());
//   }, [id]);

//   /* ---------------- PREFILL ---------------- */

//   useEffect(() => {
//     if (!task || !isEdit) return;

//     setForm({
//       subject: task.subject,
//       dueDate: task.dueDate?.slice(0, 10),
//       status: task.status,
//       priority: task.priority,
//       contactId: task.contactId || "",
//       accountId: task.accountId || "",
//       description: task.description || "",
//     });

//     if (task.contact)
//       setContactName(`${task.contact.firstName} ${task.contact.lastName || ""}`);

//     if (task.account) setAccountName(task.account.accountName);

//     if (task.reminders?.length) {
//       const r = task.reminders[0];
//       setReminderOn(true);

//       const d = new Date(r.remindAt);

//       setReminder({
//         date: d.toISOString().slice(0, 10),
//         time: d.toTimeString().slice(0, 5),
//         notify:
//           r.emailBefore !== null && r.popupBefore !== null
//             ? "BOTH"
//             : r.emailBefore !== null
//             ? "EMAIL"
//             : "POPUP",
//       });
//     }
//   }, [task]);

//   /* ---------------- SUBMIT ---------------- */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let payload = { ...form };

//     if (reminderOn && reminder.date && reminder.time) {
//       const remindAt = new Date(`${reminder.date}T${reminder.time}`);

//       payload.reminder = {
//         remindAt,
//         emailBefore:
//           reminder.notify === "EMAIL" || reminder.notify === "BOTH" ? 0 : null,
//         popupBefore:
//           reminder.notify === "POPUP" || reminder.notify === "BOTH" ? 0 : null,
//       };
//     }

//     if (isEdit) {
//       await dispatch(updateTask({ id, formData: payload }));
//     } else {
//       await dispatch(createTask(payload));
//     }

//     navigate("/tasks");
//   };

//   /* ---------------- UI ---------------- */

//   const Field = ({ label, children }) => (
//     <div className="border-b pb-2">
//       <label className="text-sm text-gray-500">{label}</label>
//       <div className="mt-1">{children}</div>
//     </div>
//   );

//   return (
//     <div className="p-6 max-w-6xl mx-auto">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">
//           {isEdit ? "Edit Task" : "Create Task"}
//         </h1>

//         <div className="flex gap-3">
//           <button onClick={() => navigate("/tasks")} className="btn-secondary">
//             Cancel
//           </button>
//           <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
//             {loading ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>

//       <form className="grid md:grid-cols-2 gap-10">

//         {/* LEFT COLUMN */}
//         <div className="space-y-6">

//           <h2 className="text-sm font-semibold text-gray-500 uppercase">
//             Task Information
//           </h2>

//           <Field label="Subject">

// <SubjectWithSuggestions
//   value={form.subject}
//   onChange={(val) => setForm({ ...form, subject: val })}
// />
//           </Field>

//           <Field label="Due Date">
//             <input
//               type="date"
//               className="crm-input"
//               value={form.dueDate}
//               onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//             />
//           </Field>

//           <Field label="Contact">
//             <div
//               onClick={() => setShowContactModal(true)}
//               className="crm-input cursor-pointer"
//             >
//               {contactName || "Select Contact"}
//             </div>
//           </Field>

//           <Field label="Account">
//             <div className="crm-input bg-gray-50">
//               {accountName || "—"}
//             </div>
//           </Field>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="space-y-6">

//           <h2 className="text-sm font-semibold text-gray-500 uppercase">
//             Additional Information
//           </h2>

//           <Field label="Status">
//             <select
//               className="crm-input"
//               value={form.status}
//               onChange={(e) => setForm({ ...form, status: e.target.value })}
//             >
//               <option value="NOT_STARTED">Not Started</option>
//               <option value="IN_PROGRESS">In Progress</option>
//               <option value="COMPLETED">Completed</option>
//             </select>
//           </Field>

//           <Field label="Priority">
//             <select
//               className="crm-input"
//               value={form.priority}
//               onChange={(e) => setForm({ ...form, priority: e.target.value })}
//             >
//               <option value="HIGH">High</option>
//               <option value="NORMAL">Normal</option>
//               <option value="LOW">Low</option>
//             </select>
//           </Field>

//           {/* REMINDER */}
//           <div className="flex justify-between items-center border-b pb-3">
//             <span className="text-sm text-gray-600">Reminder</span>

//             <button
//               type="button"
//               onClick={() => setReminderOn(!reminderOn)}
//               className={`w-11 h-6 flex items-center rounded-full p-1 transition
//               ${reminderOn ? "bg-green-500" : "bg-gray-300"}`}
//             >
//               <div
//                 className={`bg-white w-4 h-4 rounded-full shadow transform transition
//                 ${reminderOn ? "translate-x-5" : ""}`}
//               />
//             </button>
//           </div>

//           {reminderOn && (
//             <div className="bg-gray-50 border rounded-lg p-4 space-y-3">

//               <div className="flex gap-2">
//                 <input
//                   type="date"
//                   className="crm-input"
//                   value={reminder.date}
//                   onChange={(e) =>
//                     setReminder({ ...reminder, date: e.target.value })
//                   }
//                 />
//                 <input
//                   type="time"
//                   className="crm-input"
//                   value={reminder.time}
//                   onChange={(e) =>
//                     setReminder({ ...reminder, time: e.target.value })
//                   }
//                 />
//               </div>

//               <select
//                 className="crm-input"
//                 value={reminder.notify}
//                 onChange={(e) =>
//                   setReminder({ ...reminder, notify: e.target.value })
//                 }
//               >
//                 <option value="EMAIL">Email</option>
//                 <option value="POPUP">Pop Up</option>
//                 <option value="BOTH">Both</option>
//               </select>
//             </div>
//           )}
//         </div>

//         {/* DESCRIPTION */}
//         <div className="md:col-span-2 space-y-3">
//           <h2 className="text-sm font-semibold text-gray-500 uppercase">
//             Description Information
//           </h2>

//           <textarea
//             rows={4}
//             className="crm-input"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//           />
//         </div>
//       </form>

//       <ContactLookupModal
//         open={showContactModal}
//         onClose={() => setShowContactModal(false)}
//         contacts={contacts}
//         onSelect={(c) => {
//           setForm((p) => ({
//             ...p,
//             contactId: c.id,
//             accountId: c.account?.id || "",
//           }));
//           setContactName(`${c.firstName} ${c.lastName || ""}`);
//           setAccountName(c.account?.accountName || "");
//           setShowContactModal(false);
//         }}
//       />
//     </div>
//   );
// };

// export default TaskForm;

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import {
//   createDeal,
//   updateDeal,
//   fetchDeal,
//   clearCurrentDeal,
// } from "./dealSlice";
// import { fetchUsers } from "../auth/authSlice";
// import { fetchAccountsDropdown } from "../accounts/accountSlice";
// import { fetchContactsDropdown } from "../contacts/contactSlice";
// import { DEAL_STAGES, LEAD_SOURCES, DEAL_TYPES, formatLabel } from "../../constants";
// import Spinner from "../../components/Spinner";
// import toast from "react-hot-toast";
// import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// const initialForm = {
//   dealName: "",
//   amount: "",
//   expectedRevenue: "",
//   closingDate: "",
//   stage: "QUALIFICATION",
//   type: "",
//   nextStep: "",
//   leadSource: "",
//   campaignSource: "",
//   description: "",
//   dealOwnerId: "",
//   accountId: "",
//   contactId: "",
// };

// const DealForm = () => {
//   const { id } = useParams();
//   const [searchParams] = useSearchParams();
//   const isEdit = Boolean(id);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { deal, detailLoading } = useSelector((s) => s.deals);
//   const { users, user } = useSelector((s) => s.auth);
//   const { dropdown: accountDropdown } = useSelector((s) => s.accounts);
//   const { dropdown: contactDropdown } = useSelector((s) => s.contacts);

//   const [form, setForm] = useState(initialForm);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchAccountsDropdown());
//     if (isEdit) dispatch(fetchDeal(id));
//     return () => dispatch(clearCurrentDeal());
//   }, [dispatch, id, isEdit]);

//   useEffect(() => {
//     if (form.accountId) {
//       dispatch(fetchContactsDropdown({ accountId: form.accountId }));
//     }
//   }, [dispatch, form.accountId]);

//   useEffect(() => {
//     if (isEdit && deal) {
//       const formData = {};
//       Object.keys(initialForm).forEach((key) => {
//         if (key === "closingDate" && deal[key]) {
//           formData[key] = new Date(deal[key]).toISOString().split("T")[0];
//         } else {
//           formData[key] = deal[key] ?? "";
//         }
//       });
//       setForm(formData);
//     } else if (!isEdit) {
//       setForm((prev) => ({
//         ...prev,
//         dealOwnerId: user?.id || "",
//         accountId: searchParams.get("accountId") || "",
//         contactId: searchParams.get("contactId") || "",
//       }));
//     }
//   }, [deal, isEdit, user, searchParams]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     if (name === "accountId") {
//       setForm((prev) => ({ ...prev, contactId: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const payload = {};
//       Object.entries(form).forEach(([k, v]) => {
//         payload[k] = v === "" ? null : v;
//       });
//       payload.dealName = form.dealName;
//       payload.closingDate = form.closingDate;
//       payload.stage = form.stage;
//       payload.accountId = form.accountId;
//       payload.dealOwnerId = form.dealOwnerId || user.id;

//       if (isEdit) {
//         await dispatch(updateDeal({ id, ...payload })).unwrap();
//         toast.success("Deal updated successfully");
//       } else {
//         await dispatch(createDeal(payload)).unwrap();
//         toast.success("Deal created successfully");
//       }
//       navigate("/deals");
//     } catch (err) {
//       toast.error(err || "Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (isEdit && detailLoading) {
//     return <Spinner className="py-20" />;
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-4 mb-6">
//         <button
//           onClick={() => navigate("/deals")}
//           className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//         >
//           <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
//         </button>
//         <h1 className="page-title">{isEdit ? "Edit Deal" : "Create Deal"}</h1>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Deal Information */}
//         <div className="card">
//           <h2 className="section-title mb-4">Deal Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="label">
//                 Deal Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="dealName"
//                 value={form.dealName}
//                 onChange={handleChange}
//                 className="input-field"
//                 required
//               />
//             </div>
//             <div>
//               <label className="label">Deal Owner</label>
//               <select
//                 name="dealOwnerId"
//                 value={form.dealOwnerId}
//                 onChange={handleChange}
//                 className="select-field"
//               >
//                 <option value="">Select Owner</option>
//                 {users.map((u) => (
//                   <option key={u.id} value={u.id}>
//                     {u.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">
//                 Account <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="accountId"
//                 value={form.accountId}
//                 onChange={handleChange}
//                 className="select-field"
//                 required
//               >
//                 <option value="">Select Account</option>
//                 {accountDropdown.map((a) => (
//                   <option key={a.id} value={a.id}>
//                     {a.accountName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Contact</label>
//               <select
//                 name="contactId"
//                 value={form.contactId}
//                 onChange={handleChange}
//                 className="select-field"
//               >
//                 <option value="">Select Contact</option>
//                 {contactDropdown.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.firstName} {c.lastName || ""}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Amount (₹)</label>
//               <input
//                 name="amount"
//                 type="number"
//                 step="0.01"
//                 value={form.amount}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="e.g., 500000"
//               />
//             </div>
//             <div>
//               <label className="label">Expected Revenue (₹)</label>
//               <input
//                 name="expectedRevenue"
//                 type="number"
//                 step="0.01"
//                 value={form.expectedRevenue}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label className="label">
//                 Closing Date <span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="closingDate"
//                 type="date"
//                 value={form.closingDate}
//                 onChange={handleChange}
//                 className="input-field"
//                 required
//               />
//             </div>
//             <div>
//               <label className="label">
//                 Stage <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="stage"
//                 value={form.stage}
//                 onChange={handleChange}
//                 className="select-field"
//                 required
//               >
//                 {DEAL_STAGES.map((s) => (
//                   <option key={s} value={s}>
//                     {formatLabel(s)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Type</label>
//               <select
//                 name="type"
//                 value={form.type}
//                 onChange={handleChange}
//                 className="select-field"
//               >
//                 <option value="">Select Type</option>
//                 {DEAL_TYPES.map((t) => (
//                   <option key={t.value} value={t.value}>
//                     {t.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Lead Source</label>
//               <select
//                 name="leadSource"
//                 value={form.leadSource}
//                 onChange={handleChange}
//                 className="select-field"
//               >
//                 <option value="">Select Source</option>
//                 {LEAD_SOURCES.map((s) => (
//                   <option key={s.value} value={s.value}>
//                     {s.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Next Step</label>
//               <input
//                 name="nextStep"
//                 value={form.nextStep}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="e.g., Schedule demo"
//               />
//             </div>
//             <div>
//               <label className="label">Campaign Source</label>
//               <input
//                 name="campaignSource"
//                 value={form.campaignSource}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Description */}
//         <div className="card">
//           <h2 className="section-title mb-4">Description</h2>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             className="input-field"
//             rows={4}
//             placeholder="Additional details about this deal..."
//           />
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3 pb-4">
//           <button
//             type="button"
//             onClick={() => navigate("/deals")}
//             className="btn-secondary"
//           >
//             Cancel
//           </button>
//           <button type="submit" disabled={submitting} className="btn-primary">
//             {submitting
//               ? "Saving..."
//               : isEdit
//               ? "Update Deal"
//               : "Create Deal"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DealForm;
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createDeal,
  updateDeal,
  fetchDeal,
  clearCurrentDeal,
} from "./dealSlice";
import { fetchUsers } from "../auth/authSlice";
import { fetchAccountsDropdown } from "../accounts/accountSlice";
import { fetchContactsDropdown } from "../contacts/contactSlice";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

/* ================= CONSTANTS ================= */

const STAGES = [
  "RFQ",
  "VISIT_MEETING",
  "PREVIEW",
  "REGRETTED",
  "TECHNICAL_PROPOSAL",
  "COMMERCIAL_PROPOSAL",
  "REVIEW_FEEDBACK",
  "MOVED_TO_PURCHASE",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
  "CLOSED_LOST_TO_COMPETITION",
];

const PRODUCT_GROUPS = [
  "MTS_PRO",
  "MTS_STANDARD",
  "FACTEYES",
  "MTS_ASSEMBLY",
];

const WEIGHTAGES = [
  "PROBABILITY",
  "BALLPARK_OFFER",
  "BUDGETARY_OFFER",
  "DETAIL_L1",
  "DETAIL_L2",
  "FIRM_AFTER_PRICE_FINALIZATION",
  "TECHNICAL_ONLY",
];

/* ================= INITIAL STATE ================= */

const initialForm = {
  dealName: "",
  amount: "",
  expectedRevenue: "",
  closingDate: "",
  stage: "RFQ",

  dealOwnerId: "",
  personInCharge: "", // ✅ TEXT FIELD

  accountId: "",
  contactId: "",

  productGroup: "",
  weightage: "",

  nextStep: "",
  description: "",
};

/* ================= COMPONENT ================= */

const DealForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deal, detailLoading } = useSelector((s) => s.deals);
  const { users, user } = useSelector((s) => s.auth);
  const { dropdown: accounts } = useSelector((s) => s.accounts);
  const { dropdown: contacts } = useSelector((s) => s.contacts);

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  /* ================= LOAD ================= */

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAccountsDropdown());

    if (isEdit) dispatch(fetchDeal(id));

    return () => dispatch(clearCurrentDeal());
  }, [dispatch, id]);

  /* ✅ LOAD CONTACTS WHEN ACCOUNT CHANGES */

  useEffect(() => {
    if (form.accountId) {
      dispatch(fetchContactsDropdown({ accountId: form.accountId }));
    }
  }, [dispatch, form.accountId]);

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (isEdit && deal) {
      setForm({
        ...initialForm,
        ...deal,
        personInCharge: deal.personInCharge || "",
        closingDate: deal.closingDate?.slice(0, 10),
      });

      // ✅ Load contacts for existing account in edit
      if (deal.accountId) {
        dispatch(fetchContactsDropdown({ accountId: deal.accountId }));
      }
    } else if (user) {
      setForm((prev) => ({
        ...prev,
        dealOwnerId: user.id,
      }));
    }
  }, [deal, isEdit, user, dispatch]);

  /* ================= CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "accountId" && { contactId: "" }),
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v || null])
      );

      if (isEdit) {
        await dispatch(updateDeal({ id, ...payload })).unwrap();
        toast.success("Deal updated");
      } else {
        await dispatch(createDeal(payload)).unwrap();
        toast.success("Deal created");
      }

      navigate("/deals");
    } catch {
      toast.error("Failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && detailLoading) return <Spinner className="py-20" />;

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeftIcon
          onClick={() => navigate("/deals")}
          className="w-5 h-5 cursor-pointer text-gray-500"
        />
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Edit Deal" : "Create Deal"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="bg-white p-6 rounded-xl border grid md:grid-cols-2 gap-4">

          {isEdit && (
            <Input
              label="Deal Log ID"
              value={deal?.dealLogId || ""}
              disabled
            />
          )}

          <Input name="dealName" label="Deal Name *" value={form.dealName} onChange={handleChange} required />

          <Select
            name="dealOwnerId"
            label="Deal Owner"
            value={form.dealOwnerId}
            onChange={handleChange}
            options={users}
          />

          {/* ✅ TEXT INPUT */}
          <Input
            name="personInCharge"
            label="Person In Charge"
            value={form.personInCharge}
            onChange={handleChange}
            placeholder="Enter person name"
          />

          <Select
            name="accountId"
            label="Account *"
            value={form.accountId}
            onChange={handleChange}
            options={accounts}
            required
          />

          {/* ✅ CONTACT WORKS LIKE BEFORE */}
          <Select
            name="contactId"
            label="Contact"
            value={form.contactId}
            onChange={handleChange}
            options={contacts}
          />

          <Input name="amount" label="Amount" type="number" value={form.amount} onChange={handleChange} />

          <Input name="expectedRevenue" label="Expected Revenue" type="number" value={form.expectedRevenue} onChange={handleChange} />

          <Input name="closingDate" label="Closing Date *" type="date" value={form.closingDate} onChange={handleChange} required />

          <SelectSimple name="stage" label="Stage" value={form.stage} onChange={handleChange} options={STAGES} />

          <SelectSimple name="productGroup" label="Product Group" value={form.productGroup} onChange={handleChange} options={PRODUCT_GROUPS} />

          <SelectSimple name="weightage" label="Weightage" value={form.weightage} onChange={handleChange} options={WEIGHTAGES} />

          <Input name="nextStep" label="Next Step" value={form.nextStep} onChange={handleChange} />

        </div>

        <div className="bg-white p-6 rounded-xl border">
          <label className="label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/deals")} className="btn-secondary">
            Cancel
          </button>
          <button className="btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : isEdit ? "Update Deal" : "Create Deal"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default DealForm;

/* ================= REUSABLE ================= */

const Input = ({ label, ...props }) => (
  <div>
    <label className="label">{label}</label>
    <input {...props} className="input-field" />
  </div>
);

const Select = ({ label, options = [], ...props }) => (
  <div>
    <label className="label">{label}</label>
    <select {...props} className="select-field">
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name || o.accountName || `${o.firstName || ""} ${o.lastName || ""}`}
        </option>
      ))}
    </select>
  </div>
);

const SelectSimple = ({ label, options, ...props }) => (
  <div>
    <label className="label">{label}</label>
    <select {...props} className="select-field">
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  </div>
);
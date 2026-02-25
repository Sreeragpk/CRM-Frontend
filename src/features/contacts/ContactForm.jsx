// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { createContact, updateContact, fetchContact, clearCurrentContact } from "./contactSlice";
// import { fetchUsers } from "../auth/authSlice";
// import { fetchAccountsDropdown } from "../accounts/accountSlice";
// import Spinner from "../../components/Spinner";
// import toast from "react-hot-toast";
// import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// const initialForm = { firstName: "", lastName: "", email: "", phone: "", mobile: "", title: "", department: "", accountId: "", contactOwnerId: "", mailingFlat: "", mailingStreet: "", mailingCity: "", mailingState: "", mailingZip: "", mailingCountry: "", description: "" };

// const ContactForm = () => {
//   const { id } = useParams();
//   const [searchParams] = useSearchParams();
//   const isEdit = Boolean(id);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { contact, detailLoading } = useSelector((s) => s.contacts);
//   const { users, user } = useSelector((s) => s.auth);
//   const { dropdown: accountDropdown } = useSelector((s) => s.accounts);
//   const [form, setForm] = useState(initialForm);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => { dispatch(fetchUsers()); dispatch(fetchAccountsDropdown()); if (isEdit) dispatch(fetchContact(id)); return () => dispatch(clearCurrentContact()); }, [dispatch, id, isEdit]);

//   useEffect(() => {
//     if (isEdit && contact) { const d = {}; Object.keys(initialForm).forEach((k) => { d[k] = contact[k] ?? ""; }); setForm(d); }
//     else if (!isEdit) { setForm((p) => ({ ...p, contactOwnerId: user?.id || "", accountId: searchParams.get("accountId") || "" })); }
//   }, [contact, isEdit, user, searchParams]);

//   const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault(); setSubmitting(true);
//     try {
//       const payload = {}; Object.entries(form).forEach(([k, v]) => { payload[k] = v === "" ? null : v; });
//       payload.firstName = form.firstName; payload.email = form.email; payload.accountId = form.accountId; payload.contactOwnerId = form.contactOwnerId || user.id;
//       if (isEdit) { await dispatch(updateContact({ id, ...payload })).unwrap(); toast.success("Contact updated"); }
//       else { await dispatch(createContact(payload)).unwrap(); toast.success("Contact created"); }
//       navigate("/contacts");
//     } catch (err) { toast.error(err || "Error"); } finally { setSubmitting(false); }
//   };

//   if (isEdit && detailLoading) return <Spinner className="py-20" />;

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="flex items-center gap-4 mb-6">
//         <button onClick={() => navigate("/contacts")} className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeftIcon className="w-5 h-5 text-gray-500" /></button>
//         <h1 className="page-title">{isEdit ? "Edit Contact" : "Create Contact"}</h1>
//       </div>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="card">
//           <h2 className="section-title mb-4">Contact Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div><label className="label">First Name <span className="text-red-500">*</span></label><input name="firstName" value={form.firstName} onChange={handleChange} className="input-field" required /></div>
//             <div><label className="label">Last Name</label><input name="lastName" value={form.lastName} onChange={handleChange} className="input-field" /></div>
//             <div><label className="label">Email <span className="text-red-500">*</span></label><input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" required /></div>
//             <div><label className="label">Phone</label><input name="phone" value={form.phone} onChange={handleChange} className="input-field" /></div>
//             <div><label className="label">Mobile</label><input name="mobile" value={form.mobile} onChange={handleChange} className="input-field" /></div>
//             <div><label className="label">Title</label><input name="title" value={form.title} onChange={handleChange} className="input-field" /></div>
//             <div><label className="label">Department</label><input name="department" value={form.department} onChange={handleChange} className="input-field" /></div>
//             <div><label className="label">Account <span className="text-red-500">*</span></label>
//               <select name="accountId" value={form.accountId} onChange={handleChange} className="select-field" required>
//                 <option value="">Select Account</option>
//                 {accountDropdown.map((a) => <option key={a.id} value={a.id}>{a.accountName}</option>)}
//               </select>
//             </div>
//             <div><label className="label">Owner</label>
//               <select name="contactOwnerId" value={form.contactOwnerId} onChange={handleChange} className="select-field">
//                 <option value="">Select Owner</option>
//                 {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
//               </select>
//             </div>
//           </div>
//         </div>
//         <div className="card">
//           <h2 className="section-title mb-4">Mailing Address</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div><label className="label">Flat / Building</label><input name="mailingFlat" value={form.mailingFlat} onChange={handleChange} className="input-field" /></div>
//             <div><label className="label">Street</label><input name="mailingStreet" value={form.mailingStreet} onChange={handleChange} className="input-field" /></div>
//             <div><label className="label">City</label><input name="mailingCity" value={form.mailingCity} onChange={handleChange} className="input-field" /></div>
//             <div><label className="label">State</label><input name="mailingState" value={form.mailingState} onChange={handleChange} className="input-field" /></div>
//             <div><label className="label">ZIP</label><input name="mailingZip" value={form.mailingZip} onChange={handleChange} className="input-field" /></div>
//             <div><label className="label">Country</label><input name="mailingCountry" value={form.mailingCountry} onChange={handleChange} className="input-field" /></div>
//           </div>
//         </div>
//         <div className="card">
//           <h2 className="section-title mb-4">Description</h2>
//           <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={4} />
//         </div>
//         <div className="flex justify-end gap-3 pb-4">
//           <button type="button" onClick={() => navigate("/contacts")} className="btn-secondary">Cancel</button>
//           <button type="submit" disabled={submitting} className="btn-primary">{submitting ? "Saving..." : isEdit ? "Update Contact" : "Create Contact"}</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ContactForm;
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  createContact,
  updateContact,
  fetchContact,
  clearCurrentContact,
} from "./contactSlice";
import { fetchUsers } from "../auth/authSlice";
import { fetchAccountsDropdown } from "../accounts/accountSlice";
import { LEAD_SOURCES } from "../../constants";
import Spinner from "../../components/Spinner";
import ImageUpload from "../../components/ImageUpload";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  mobile: "",
  title: "",
  department: "",
  accountId: "",
  contactOwnerId: "",
  leadSource: "",
  image: "",
  mailingFlat: "",
  mailingStreet: "",
  mailingCity: "",
  mailingState: "",
  mailingZip: "",
  mailingCountry: "",
  description: "",
};

const ContactForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contact, detailLoading } = useSelector((s) => s.contacts);
  const { users, user } = useSelector((s) => s.auth);
  const { dropdown: accountDropdown } = useSelector((s) => s.accounts);

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAccountsDropdown());
    if (isEdit) dispatch(fetchContact(id));
    return () => dispatch(clearCurrentContact());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && contact) {
      const formData = {};
      Object.keys(initialForm).forEach((key) => {
        formData[key] = contact[key] ?? "";
      });
      setForm(formData);
    } else if (!isEdit) {
      setForm((prev) => ({
        ...prev,
        contactOwnerId: user?.id || "",
        accountId: searchParams.get("accountId") || "",
      }));
    }
  }, [contact, isEdit, user, searchParams]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (imageData) => {
    setForm((prev) => ({ ...prev, image: imageData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {};
      Object.entries(form).forEach(([k, v]) => {
        payload[k] = v === "" ? null : v;
      });
      payload.firstName = form.firstName;
      payload.email = form.email;
      payload.accountId = form.accountId;
      payload.contactOwnerId = form.contactOwnerId || user.id;

      if (isEdit) {
        await dispatch(updateContact({ id, ...payload })).unwrap();
        toast.success("Contact updated successfully");
      } else {
        await dispatch(createContact(payload)).unwrap();
        toast.success("Contact created successfully");
      }
      navigate("/contacts");
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && detailLoading) {
    return <Spinner className="py-20" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/contacts")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="page-title">{isEdit ? "Edit Contact" : "Create Contact"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Photo */}
        <div className="card">
          <h2 className="section-title mb-4">Contact Photo</h2>
          <ImageUpload
            value={form.image}
            onChange={handleImageChange}
            label="Profile Photo"
            shape="circle"
          />
        </div>

        {/* Contact Information */}
        <div className="card">
          <h2 className="section-title mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="label">Mobile</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Title / Designation</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., CEO, Manager"
              />
            </div>
            <div>
              <label className="label">Department</label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">
                Account <span className="text-red-500">*</span>
              </label>
              <select
                name="accountId"
                value={form.accountId}
                onChange={handleChange}
                className="select-field"
                required
              >
                <option value="">Select Account</option>
                {accountDropdown.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.accountName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Contact Owner</label>
              <select
                name="contactOwnerId"
                value={form.contactOwnerId}
                onChange={handleChange}
                className="select-field"
              >
                <option value="">Select Owner</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Lead Source</label>
              <select
                name="leadSource"
                value={form.leadSource}
                onChange={handleChange}
                className="select-field"
              >
                <option value="">Select Lead Source</option>
                {LEAD_SOURCES.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mailing Address */}
        <div className="card">
          <h2 className="section-title mb-4">Mailing Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Flat / Building</label>
              <input
                name="mailingFlat"
                value={form.mailingFlat}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Street</label>
              <input
                name="mailingStreet"
                value={form.mailingStreet}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">City</label>
              <input
                name="mailingCity"
                value={form.mailingCity}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">State</label>
              <input
                name="mailingState"
                value={form.mailingState}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">PIN Code</label>
              <input
                name="mailingZip"
                value={form.mailingZip}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Country</label>
              <input
                name="mailingCountry"
                value={form.mailingCountry}
                onChange={handleChange}
                className="input-field"
                placeholder="India"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card">
          <h2 className="section-title mb-4">Description</h2>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input-field"
            rows={4}
            placeholder="Additional notes about this contact..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-4">
          <button
            type="button"
            onClick={() => navigate("/contacts")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting
              ? "Saving..."
              : isEdit
              ? "Update Contact"
              : "Create Contact"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
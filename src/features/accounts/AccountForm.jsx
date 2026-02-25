import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createAccount,
  updateAccount,
  fetchAccount,
  clearCurrentAccount,
  fetchAccountsDropdown,
} from "./accountSlice";
import { fetchUsers } from "../auth/authSlice";
import { INDUSTRIES, ACCOUNT_TYPES, ACCOUNT_RATINGS } from "../../constants";
import Spinner from "../../components/Spinner";
import ImageUpload from "../../components/ImageUpload";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const initialForm = {
  accountName: "",
  accountOwnerId: "",
  parentAccountId: "",
  accountType: "",
  industry: "",
  annualRevenue: "",
  employees: "",
  rating: "",
  phone: "",
  website: "",
  ownership: "",
  image: "",
  billingStreet: "",
  billingCity: "",
  billingState: "",
  billingPincode: "",
  billingCountry: "",
  shippingStreet: "",
  shippingCity: "",
  shippingState: "",
  shippingPincode: "",
  shippingCountry: "",
};

const AccountForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { account, detailLoading } = useSelector((s) => s.accounts);
  const { users, user } = useSelector((s) => s.auth);
  const { dropdown: accountDropdown } = useSelector((s) => s.accounts);

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [copyBilling, setCopyBilling] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAccountsDropdown());
    if (isEdit) dispatch(fetchAccount(id));
    return () => dispatch(clearCurrentAccount());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && account) {
      const formData = {};
      Object.keys(initialForm).forEach((key) => {
        formData[key] = account[key] ?? "";
      });
      setForm(formData);
    } else if (!isEdit && user) {
      setForm((prev) => ({ ...prev, accountOwnerId: user.id }));
    }
  }, [account, isEdit, user]);

  useEffect(() => {
    if (copyBilling) {
      setForm((prev) => ({
        ...prev,
        shippingStreet: prev.billingStreet,
        shippingCity: prev.billingCity,
        shippingState: prev.billingState,
        shippingPincode: prev.billingPincode,
        shippingCountry: prev.billingCountry,
      }));
    }
  }, [copyBilling]);

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
      Object.entries(form).forEach(([key, val]) => {
        payload[key] = val === "" ? null : val;
      });
      payload.accountName = form.accountName;
      payload.accountOwnerId = form.accountOwnerId || user.id;

      if (isEdit) {
        await dispatch(updateAccount({ id, ...payload })).unwrap();
        toast.success("Account updated successfully");
      } else {
        await dispatch(createAccount(payload)).unwrap();
        toast.success("Account created successfully");
      }
      navigate("/accounts");
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
          onClick={() => navigate("/accounts")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="page-title">{isEdit ? "Edit Account" : "Create Account"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Image */}
        <div className="card">
          <h2 className="section-title mb-4">Account Logo</h2>
          <ImageUpload
            value={form.image}
            onChange={handleImageChange}
            label="Company Logo"
            shape="square"
          />
        </div>

        {/* Account Info */}
        <div className="card">
          <h2 className="section-title mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Account Name <span className="text-red-500">*</span>
              </label>
              <input
                name="accountName"
                value={form.accountName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">
                Account Owner <span className="text-red-500">*</span>
              </label>
              <select
                name="accountOwnerId"
                value={form.accountOwnerId}
                onChange={handleChange}
                className="select-field"
                required
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
              <label className="label">Parent Account</label>
              <select
                name="parentAccountId"
                value={form.parentAccountId}
                onChange={handleChange}
                className="select-field"
              >
                <option value="">None</option>
                {accountDropdown
                  .filter((a) => a.id !== id)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="label">Account Type</label>
              <select
                name="accountType"
                value={form.accountType}
                onChange={handleChange}
                className="select-field"
              >
                <option value="">Select Type</option>
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Industry</label>
              <select
                name="industry"
                value={form.industry}
                onChange={handleChange}
                className="select-field"
              >
                <option value="">Select Industry</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Rating</label>
              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="select-field"
              >
                <option value="">Select Rating</option>
                {ACCOUNT_RATINGS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Annual Revenue (₹)</label>
              <input
                name="annualRevenue"
                type="number"
                value={form.annualRevenue}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., 10000000"
              />
            </div>
            <div>
              <label className="label">Employees</label>
              <input
                name="employees"
                type="number"
                value={form.employees}
                onChange={handleChange}
                className="input-field"
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
              <label className="label">Website</label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="label">Ownership</label>
              <input
                name="ownership"
                value={form.ownership}
                onChange={handleChange}
                className="input-field"
                placeholder="Private / Public"
              />
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="card">
          <h2 className="section-title mb-4">Billing Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Street</label>
              <input
                name="billingStreet"
                value={form.billingStreet}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">City</label>
              <input
                name="billingCity"
                value={form.billingCity}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">State</label>
              <input
                name="billingState"
                value={form.billingState}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Pincode</label>
              <input
                name="billingPincode"
                value={form.billingPincode}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Country</label>
              <input
                name="billingCountry"
                value={form.billingCountry}
                onChange={handleChange}
                className="input-field"
                defaultValue="India"
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Shipping Address</h2>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={copyBilling}
                onChange={(e) => setCopyBilling(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Same as billing
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Street</label>
              <input
                name="shippingStreet"
                value={form.shippingStreet}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">City</label>
              <input
                name="shippingCity"
                value={form.shippingCity}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">State</label>
              <input
                name="shippingState"
                value={form.shippingState}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Pincode</label>
              <input
                name="shippingPincode"
                value={form.shippingPincode}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Country</label>
              <input
                name="shippingCountry"
                value={form.shippingCountry}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-4">
          <button
            type="button"
            onClick={() => navigate("/accounts")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting
              ? "Saving..."
              : isEdit
              ? "Update Account"
              : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
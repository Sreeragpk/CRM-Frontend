// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { fetchContact, clearCurrentContact } from "./contactSlice";
// import { formatCurrency, formatDate, formatLabel } from "../../constants";
// import Spinner from "../../components/Spinner";
// import Avatar from "../../components/Avatar";
// import DetailField from "../../components/DetailField";
// import { PencilSquareIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// const ContactDetail = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { contact, detailLoading } = useSelector((s) => s.contacts);

//   useEffect(() => { dispatch(fetchContact(id)); return () => dispatch(clearCurrentContact()); }, [dispatch, id]);

//   if (detailLoading || !contact) return <Spinner className="py-20" />;

//   const fullName = `${contact.firstName} ${contact.lastName || ""}`.trim();

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="flex items-start justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate("/contacts")} className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeftIcon className="w-5 h-5 text-gray-500" /></button>
//           <Avatar name={contact.firstName} secondName={contact.lastName} size="xl" />
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
//             <p className="text-sm text-gray-500">
//               {contact.title && `${contact.title} · `}
//               <Link to={`/accounts/${contact.account?.id}`} className="link">{contact.account?.accountName}</Link>
//             </p>
//           </div>
//         </div>
//         <button onClick={() => navigate(`/contacts/${id}/edit`)} className="btn-primary"><PencilSquareIcon className="w-5 h-5 mr-1.5" /> Edit</button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <div className="card">
//             <h2 className="section-title mb-4">Contact Details</h2>
//             <div className="grid grid-cols-2 gap-x-6 gap-y-4">
//               <DetailField label="Email" value={contact.email} />
//               <DetailField label="Phone" value={contact.phone} />
//               <DetailField label="Mobile" value={contact.mobile} />
//               <DetailField label="Department" value={contact.department} />
//               <DetailField label="Title" value={contact.title} />
//               <DetailField label="Owner" value={contact.owner?.name} />
//             </div>
//           </div>

//           <div className="card">
//             <h2 className="section-title mb-4">Mailing Address</h2>
//             <p className="text-sm text-gray-700">
//               {[contact.mailingFlat, contact.mailingStreet, contact.mailingCity, contact.mailingState, contact.mailingZip, contact.mailingCountry].filter(Boolean).join(", ") || "—"}
//             </p>
//           </div>

//           {contact.description && (
//             <div className="card">
//               <h2 className="section-title mb-4">Description</h2>
//               <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.description}</p>
//             </div>
//           )}

//           <div className="card">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="section-title">Deals ({contact.deals?.length || 0})</h2>
//               <button onClick={() => navigate(`/deals/new?accountId=${contact.accountId}&contactId=${contact.id}`)} className="link text-sm">+ Add Deal</button>
//             </div>
//             {contact.deals?.length > 0 ? (
//               <div className="space-y-2">
//                 {contact.deals.map((d) => (
//                   <Link key={d.id} to={`/deals/${d.id}`} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
//                     <p className="font-medium text-sm">{d.dealName}</p>
//                     <div className="text-right">
//                       <p className="text-sm font-semibold">{formatCurrency(d.amount)}</p>
//                       <span className="text-xs text-gray-500">{formatLabel(d.stage)}</span>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             ) : <p className="text-gray-400 text-sm text-center py-6">No deals yet</p>}
//           </div>
//         </div>

//         <div className="card h-fit">
//           <h2 className="section-title mb-4">Audit Info</h2>
//           <div className="space-y-3">
//             <DetailField label="Created By" value={contact.createdBy?.name} />
//             <DetailField label="Modified By" value={contact.modifiedBy?.name} />
//             <DetailField label="Created At" value={formatDate(contact.createdAt)} />
//             <DetailField label="Updated At" value={formatDate(contact.updatedAt)} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactDetail;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchContact, clearCurrentContact } from "./contactSlice";
import { formatCurrency, formatDate, formatLabel } from "../../constants";
import Spinner from "../../components/Spinner";
import Avatar from "../../components/Avatar";
import DetailField from "../../components/DetailField";
import { PencilSquareIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const ContactDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contact, detailLoading } = useSelector((s) => s.contacts);

  useEffect(() => {
    dispatch(fetchContact(id));
    return () => dispatch(clearCurrentContact());
  }, [dispatch, id]);

  if (detailLoading || !contact) {
    return <Spinner className="py-20" />;
  }

  const fullName = `${contact.firstName} ${contact.lastName || ""}`.trim();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/contacts")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
          </button>
          <Avatar
            name={contact.firstName}
            secondName={contact.lastName}
            size="xl"
            image={contact.image}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
            <p className="text-sm text-gray-500">
              {contact.title && `${contact.title} · `}
              <Link
                to={`/accounts/${contact.account?.id}`}
                className="link"
              >
                {contact.account?.accountName}
              </Link>
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/contacts/${id}/edit`)}
          className="btn-primary"
        >
          <PencilSquareIcon className="w-5 h-5 mr-1.5" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details */}
          <div className="card">
            <h2 className="section-title mb-4">Contact Details</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailField label="Email" value={contact.email} />
              <DetailField label="Phone" value={contact.phone} />
              <DetailField label="Mobile" value={contact.mobile} />
              <DetailField label="Department" value={contact.department} />
              <DetailField label="Title" value={contact.title} />
              <DetailField label="Owner" value={contact.owner?.name} />
              <DetailField
                label="Lead Source"
                value={formatLabel(contact.leadSource)}
              />
            </div>
          </div>

          {/* Mailing Address */}
          <div className="card">
            <h2 className="section-title mb-4">Mailing Address</h2>
            <p className="text-sm text-gray-700">
              {[
                contact.mailingFlat,
                contact.mailingStreet,
                contact.mailingCity,
                contact.mailingState,
                contact.mailingZip,
                contact.mailingCountry,
              ]
                .filter(Boolean)
                .join(", ") || "—"}
            </p>
          </div>

          {/* Description */}
          {contact.description && (
            <div className="card">
              <h2 className="section-title mb-4">Description</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {contact.description}
              </p>
            </div>
          )}

          {/* Deals */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">
                Deals ({contact.deals?.length || 0})
              </h2>
              <button
                onClick={() =>
                  navigate(
                    `/deals/new?accountId=${contact.accountId}&contactId=${contact.id}`
                  )
                }
                className="link text-sm"
              >
                + Add Deal
              </button>
            </div>
            {contact.deals?.length > 0 ? (
              <div className="space-y-2">
                {contact.deals.map((deal) => (
                  <Link
                    key={deal.id}
                    to={`/deals/${deal.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium text-sm">{deal.dealName}</p>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(deal.amount)}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatLabel(deal.stage)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">
                No deals yet
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="card h-fit">
          <h2 className="section-title mb-4">Audit Info</h2>
          <div className="space-y-3">
            <DetailField label="Created By" value={contact.createdBy?.name} />
            <DetailField label="Modified By" value={contact.modifiedBy?.name} />
            <DetailField
              label="Created At"
              value={formatDate(contact.createdAt)}
            />
            <DetailField
              label="Updated At"
              value={formatDate(contact.updatedAt)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
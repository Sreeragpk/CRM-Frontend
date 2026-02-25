// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { fetchAccount, clearCurrentAccount } from "./accountSlice";
// import {
//   formatCurrency,
//   formatLabel,
//   STAGE_COLORS,
// } from "../../constants";
// import Spinner from "../../components/Spinner";
// import Avatar from "../../components/Avatar";
// import DetailField from "../../components/DetailField";
// import {
//   BuildingOffice2Icon,
//   PencilSquareIcon,
//   PhoneIcon,
//   GlobeAltIcon,
//   UserGroupIcon,
//   CurrencyDollarIcon,
//   ArrowLeftIcon,
// } from "@heroicons/react/24/outline";

// const AccountDetail = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { account, detailLoading } = useSelector((s) => s.accounts);

//   useEffect(() => {
//     dispatch(fetchAccount(id));
//     return () => dispatch(clearCurrentAccount());
//   }, [dispatch, id]);

//   if (detailLoading || !account) {
//     return <Spinner className="py-20" />;
//   }

//   const statCards = [
//     {
//       icon: PhoneIcon,
//       label: "Phone",
//       value: account.phone || "—",
//     },
//     {
//       icon: GlobeAltIcon,
//       label: "Website",
//       value: account.website || "—",
//     },
//     {
//       icon: UserGroupIcon,
//       label: "Employees",
//       value: account.employees?.toLocaleString() || "—",
//     },
//     {
//       icon: CurrencyDollarIcon,
//       label: "Revenue",
//       value: formatCurrency(account.annualRevenue),
//     },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="flex items-start justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("/accounts")}
//             className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
//           </button>
//           <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
//             <BuildingOffice2Icon className="w-7 h-7 text-blue-600" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               {account.accountName}
//             </h1>
//             <p className="text-sm text-gray-500">
//               {account.accountNumber} · Owner:{" "}
//               {account.owner?.name}
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={() => navigate(`/accounts/${id}/edit`)}
//           className="btn-primary"
//         >
//           <PencilSquareIcon className="w-5 h-5 mr-1.5" />
//           Edit
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {statCards.map((stat) => (
//               <div key={stat.label} className="card text-center py-4">
//                 <stat.icon className="w-5 h-5 text-gray-400 mx-auto mb-2" />
//                 <p className="text-xs text-gray-500">{stat.label}</p>
//                 <p className="font-semibold text-sm mt-0.5 truncate px-2">
//                   {stat.value}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Details */}
//           <div className="card">
//             <h2 className="section-title mb-4">Account Details</h2>
//             <div className="grid grid-cols-2 gap-x-6 gap-y-4">
//               <DetailField
//                 label="Type"
//                 value={formatLabel(account.accountType)}
//               />
//               <DetailField
//                 label="Industry"
//                 value={account.industry}
//               />
//               <DetailField label="Rating" value={account.rating} />
//               <DetailField
//                 label="Ownership"
//                 value={account.ownership}
//               />
//               <DetailField
//                 label="Parent Account"
//                 value={account.parentAccount?.accountName}
//               />
//             </div>
//           </div>

//           {/* Addresses */}
//           <div className="card">
//             <h2 className="section-title mb-4">Addresses</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <p className="text-sm font-medium text-gray-500 mb-2">
//                   Billing Address
//                 </p>
//                 <p className="text-sm text-gray-700">
//                   {[
//                     account.billingStreet,
//                     account.billingCity,
//                     account.billingState,
//                     account.billingPincode,
//                     account.billingCountry,
//                   ]
//                     .filter(Boolean)
//                     .join(", ") || "—"}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500 mb-2">
//                   Shipping Address
//                 </p>
//                 <p className="text-sm text-gray-700">
//                   {[
//                     account.shippingStreet,
//                     account.shippingCity,
//                     account.shippingState,
//                     account.shippingPincode,
//                     account.shippingCountry,
//                   ]
//                     .filter(Boolean)
//                     .join(", ") || "—"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Deals */}
//           <div className="card">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="section-title">
//                 Deals ({account.deals?.length || 0})
//               </h2>
//               <button
//                 onClick={() =>
//                   navigate(`/deals/new?accountId=${id}`)
//                 }
//                 className="link text-sm"
//               >
//                 + Add Deal
//               </button>
//             </div>
//             {account.deals?.length > 0 ? (
//               <div className="space-y-2">
//                 {account.deals.map((deal) => (
//                   <Link
//                     key={deal.id}
//                     to={`/deals/${deal.id}`}
//                     className="flex items-center justify-between p-3 rounded-lg
//                       border border-gray-100 hover:bg-gray-50 transition-colors"
//                   >
//                     <div>
//                       <p className="font-medium text-sm">
//                         {deal.dealName}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {deal.owner?.name}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold text-sm">
//                         {formatCurrency(deal.amount)}
//                       </p>
//                       <span
//                         className={`badge text-[10px] ${
//                           STAGE_COLORS[deal.stage] || "badge-gray"
//                         }`}
//                       >
//                         {formatLabel(deal.stage)}
//                       </span>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-400 text-sm text-center py-6">
//                 No deals yet
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Contacts */}
//           <div className="card">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="section-title">
//                 Contacts ({account.contacts?.length || 0})
//               </h2>
//               <button
//                 onClick={() =>
//                   navigate(`/contacts/new?accountId=${id}`)
//                 }
//                 className="link text-sm"
//               >
//                 + Add
//               </button>
//             </div>
//             {account.contacts?.length > 0 ? (
//               <div className="space-y-2">
//                 {account.contacts.map((contact) => (
//                   <Link
//                     key={contact.id}
//                     to={`/contacts/${contact.id}`}
//                     className="flex items-center gap-3 p-3 rounded-lg
//                       border border-gray-100 hover:bg-gray-50 transition-colors"
//                   >
//                     <Avatar
//                       name={contact.firstName}
//                       secondName={contact.lastName}
//                       size="sm"
//                     />
//                     <div className="min-w-0">
//                       <p className="font-medium text-sm truncate">
//                         {contact.firstName}{" "}
//                         {contact.lastName || ""}
//                       </p>
//                       <p className="text-xs text-gray-500 truncate">
//                         {contact.email}
//                       </p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-400 text-sm text-center py-6">
//                 No contacts yet
//               </p>
//             )}
//           </div>

//           {/* Child Accounts */}
//           {account.childAccounts?.length > 0 && (
//             <div className="card">
//               <h2 className="section-title mb-4">Child Accounts</h2>
//               <div className="space-y-2">
//                 {account.childAccounts.map((child) => (
//                   <Link
//                     key={child.id}
//                     to={`/accounts/${child.id}`}
//                     className="block p-3 rounded-lg border border-gray-100
//                       hover:bg-gray-50 transition-colors text-sm font-medium link"
//                   >
//                     {child.accountName}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountDetail;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchAccount, clearCurrentAccount } from "./accountSlice";
import { formatCurrency, formatLabel, STAGE_COLORS } from "../../constants";
import Spinner from "../../components/Spinner";
import Avatar from "../../components/Avatar";
import DetailField from "../../components/DetailField";
import {
  BuildingOffice2Icon,
  PencilSquareIcon,
  PhoneIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const AccountDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account, detailLoading } = useSelector((s) => s.accounts);

  useEffect(() => {
    dispatch(fetchAccount(id));
    return () => dispatch(clearCurrentAccount());
  }, [dispatch, id]);

  if (detailLoading || !account) {
    return <Spinner className="py-20" />;
  }

  const statCards = [
    { icon: PhoneIcon, label: "Phone", value: account.phone || "—" },
    { icon: GlobeAltIcon, label: "Website", value: account.website || "—" },
    { icon: UserGroupIcon, label: "Employees", value: account.employees?.toLocaleString("en-IN") || "—" },
    { icon: CurrencyRupeeIcon, label: "Revenue", value: formatCurrency(account.annualRevenue) },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/accounts")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
          </button>
          
          {/* Account Image or Icon */}
          {account.image ? (
            <img 
              src={account.image} 
              alt={account.accountName}
              className="w-14 h-14 rounded-xl object-cover"
            />
          ) : (
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <BuildingOffice2Icon className="w-7 h-7 text-blue-600" />
            </div>
          )}
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{account.accountName}</h1>
            <p className="text-sm text-gray-500">
              {account.accountNumber} · Owner: {account.owner?.name}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/accounts/${id}/edit`)}
          className="btn-primary"
        >
          <PencilSquareIcon className="w-5 h-5 mr-1.5" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <div key={stat.label} className="card text-center py-4">
                <stat.icon className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="font-semibold text-sm mt-0.5 truncate px-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="card">
            <h2 className="section-title mb-4">Account Details</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailField label="Type" value={formatLabel(account.accountType)} />
              <DetailField label="Industry" value={account.industry} />
              <DetailField label="Rating" value={account.rating} />
              <DetailField label="Ownership" value={account.ownership} />
              <DetailField label="Parent Account" value={account.parentAccount?.accountName} />
            </div>
          </div>

          {/* Addresses */}
          <div className="card">
            <h2 className="section-title mb-4">Addresses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Billing Address</p>
                <p className="text-sm text-gray-700">
                  {[
                    account.billingStreet,
                    account.billingCity,
                    account.billingState,
                    account.billingPincode,
                    account.billingCountry,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Shipping Address</p>
                <p className="text-sm text-gray-700">
                  {[
                    account.shippingStreet,
                    account.shippingCity,
                    account.shippingState,
                    account.shippingPincode,
                    account.shippingCountry,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Deals */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Deals ({account.deals?.length || 0})</h2>
              <button
                onClick={() => navigate(`/deals/new?accountId=${id}`)}
                className="link text-sm"
              >
                + Add Deal
              </button>
            </div>
            {account.deals?.length > 0 ? (
              <div className="space-y-2">
                {account.deals.map((deal) => (
                  <Link
                    key={deal.id}
                    to={`/deals/${deal.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{deal.dealName}</p>
                      <p className="text-xs text-gray-500">{deal.owner?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatCurrency(deal.amount)}</p>
                      <span className={`badge text-[10px] ${STAGE_COLORS[deal.stage] || "badge-gray"}`}>
                        {formatLabel(deal.stage)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">No deals yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contacts */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Contacts ({account.contacts?.length || 0})</h2>
              <button
                onClick={() => navigate(`/contacts/new?accountId=${id}`)}
                className="link text-sm"
              >
                + Add
              </button>
            </div>
            {account.contacts?.length > 0 ? (
              <div className="space-y-2">
                {account.contacts.map((contact) => (
                  <Link
                    key={contact.id}
                    to={`/contacts/${contact.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <Avatar
                      name={contact.firstName}
                      secondName={contact.lastName}
                      size="sm"
                      image={contact.image}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {contact.firstName} {contact.lastName || ""}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">No contacts yet</p>
            )}
          </div>

          {/* Child Accounts */}
          {account.childAccounts?.length > 0 && (
            <div className="card">
              <h2 className="section-title mb-4">Child Accounts</h2>
              <div className="space-y-2">
                {account.childAccounts.map((child) => (
                  <Link
                    key={child.id}
                    to={`/accounts/${child.id}`}
                    className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-sm font-medium link"
                  >
                    {child.accountName}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
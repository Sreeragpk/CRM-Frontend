// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { fetchDeal, clearCurrentDeal } from "./dealSlice";
// import { STAGE_COLORS, PROGRESS_STAGES, formatCurrency, formatDate, formatLabel } from "../../constants";
// import Spinner from "../../components/Spinner";
// import DetailField from "../../components/DetailField";
// import { CurrencyDollarIcon, PencilSquareIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// const DealDetail = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { deal, detailLoading } = useSelector((s) => s.deals);

//   useEffect(() => { dispatch(fetchDeal(id)); return () => dispatch(clearCurrentDeal()); }, [dispatch, id]);

//   if (detailLoading || !deal) return <Spinner className="py-20" />;

//   const currentIdx = PROGRESS_STAGES.indexOf(deal.stage);
//   const isClosed = deal.stage.startsWith("CLOSED");

//   return (
//     <div className="max-w-5xl mx-auto">
//       {/* Header */}
//       <div className="flex items-start justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate("/deals")} className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeftIcon className="w-5 h-5 text-gray-500" /></button>
//           <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center"><CurrencyDollarIcon className="w-7 h-7 text-green-600" /></div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{deal.dealName}</h1>
//             <div className="flex items-center gap-2 mt-1">
//               <span className={`badge ${STAGE_COLORS[deal.stage] || "badge-gray"}`}>{formatLabel(deal.stage)}</span>
//               <span className="text-sm text-gray-500">· {formatCurrency(deal.amount)}</span>
//             </div>
//           </div>
//         </div>
//         <button onClick={() => navigate(`/deals/${id}/edit`)} className="btn-primary"><PencilSquareIcon className="w-5 h-5 mr-1.5" /> Edit</button>
//       </div>

//       {/* Progress */}
//       {!isClosed && (
//         <div className="card mb-6">
//           <p className="text-xs font-semibold text-gray-500 mb-3">DEAL PROGRESS</p>
//           <div className="flex gap-1">
//             {PROGRESS_STAGES.map((s, i) => (
//               <div key={s} className={`flex-1 h-2 rounded-full transition-colors ${i <= currentIdx ? "bg-blue-500" : "bg-gray-200"}`} title={formatLabel(s)} />
//             ))}
//           </div>
//           <div className="flex justify-between mt-2"><span className="text-xs text-gray-400">Qualification</span><span className="text-xs text-gray-400">Closed Won</span></div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <div className="card">
//             <h2 className="section-title mb-4">Deal Details</h2>
//             <div className="grid grid-cols-2 gap-x-6 gap-y-4">
//               <DetailField label="Amount" value={formatCurrency(deal.amount)} />
//               <DetailField label="Expected Revenue" value={formatCurrency(deal.expectedRevenue)} />
//               <DetailField label="Probability" value={deal.probability != null ? `${deal.probability}%` : null} />
//               <DetailField label="Closing Date" value={formatDate(deal.closingDate)} />
//               <DetailField label="Type" value={formatLabel(deal.type)} />
//               <DetailField label="Lead Source" value={formatLabel(deal.leadSource)} />
//               <DetailField label="Campaign" value={deal.campaignSource} />
//               <DetailField label="Next Step" value={deal.nextStep} />
//             </div>
//           </div>
//           {deal.description && <div className="card"><h2 className="section-title mb-4">Description</h2><p className="text-sm text-gray-700 whitespace-pre-wrap">{deal.description}</p></div>}
//         </div>

//         <div className="space-y-6">
//           <div className="card">
//             <h2 className="section-title mb-4">Related</h2>
//             <div className="space-y-4">
//               <DetailField label="Account"><Link to={`/accounts/${deal.account?.id}`} className="link text-sm">{deal.account?.accountName}</Link></DetailField>
//               {deal.contact && <DetailField label="Contact"><Link to={`/contacts/${deal.contact?.id}`} className="link text-sm">{deal.contact?.firstName} {deal.contact?.lastName || ""}</Link></DetailField>}
//               <DetailField label="Owner" value={deal.owner?.name} />
//             </div>
//           </div>
//           <div className="card">
//             <h2 className="section-title mb-4">Audit Info</h2>
//             <div className="space-y-3">
//               <DetailField label="Created By" value={deal.createdBy?.name} />
//               <DetailField label="Modified By" value={deal.modifiedBy?.name} />
//               <DetailField label="Created" value={formatDate(deal.createdAt)} />
//               <DetailField label="Updated" value={formatDate(deal.updatedAt)} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DealDetail;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchDeal, updateDeal, clearCurrentDeal } from "./dealSlice";
import {
  STAGE_COLORS,
  PROGRESS_STAGES,
  formatCurrency,
  formatDate,
  formatLabel,
} from "../../constants";
import Spinner from "../../components/Spinner";
import DetailField from "../../components/DetailField";
import {
  CurrencyDollarIcon,
  PencilSquareIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const DealDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deal, detailLoading } = useSelector((s) => s.deals);

  const [tab, setTab] = useState("overview");
  const [updatingStage, setUpdatingStage] = useState(false);

  useEffect(() => {
    dispatch(fetchDeal(id));
    return () => dispatch(clearCurrentDeal());
  }, [dispatch, id]);

  /* ================= STAGE CHANGE ================= */

  const handleStageChange = async (stage) => {
    if (stage === deal.stage) return;

    try {
      setUpdatingStage(true);
      await dispatch(updateDeal({ id, stage })).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStage(false);
    }
  };

  if (detailLoading || !deal) return <Spinner className="py-20" />;

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">

          <ArrowLeftIcon
            onClick={() => navigate("/deals")}
            className="w-5 h-5 cursor-pointer text-gray-500"
          />

          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
            <CurrencyDollarIcon className="w-7 h-7 text-green-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">{deal.dealName}</h1>
            <p className="text-sm text-gray-500">
              {deal.dealLogId} • {formatCurrency(deal.amount)}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/deals/${id}/edit`)}
          className="btn-primary"
        >
          <PencilSquareIcon className="w-5 h-5 mr-1.5" />
          Edit
        </button>
      </div>

      {/* ================= STAGE BAR ================= */}

      <div className="card">
        <p className="text-xs font-semibold text-gray-500 mb-4">
          DEAL STAGE
        </p>

        <div className="flex flex-wrap gap-2">
          {PROGRESS_STAGES.map((stage) => (
            <button
              key={stage}
              disabled={updatingStage}
              onClick={() => handleStageChange(stage)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
              ${
                deal.stage === stage
                  ? STAGE_COLORS[stage]
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {formatLabel(stage)}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-500 mt-3">
          Probability: <b>{deal.probability ?? 0}%</b>
        </div>
      </div>

      {/* ================= TABS ================= */}

      <div className="flex gap-6 border-b text-sm">
        <button
          onClick={() => setTab("overview")}
          className={`pb-2 ${
            tab === "overview" && "border-b-2 border-blue-600 font-semibold"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setTab("timeline")}
          className={`pb-2 ${
            tab === "timeline" && "border-b-2 border-blue-600 font-semibold"
          }`}
        >
          Timeline
        </button>
      </div>

      {/* ================= OVERVIEW ================= */}

      {tab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* DEAL DETAILS */}
            <div className="card">
              <h2 className="section-title mb-4">Deal Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Product Group" value={formatLabel(deal.productGroup)} />
                <DetailField label="Weightage" value={formatLabel(deal.weightage)} />
                <DetailField label="Closing Date" value={formatDate(deal.closingDate)} />
                <DetailField label="Person In Charge" value={deal.personInCharge} />
                <DetailField label="Next Step" value={deal.nextStep} />
              </div>
            </div>

            {/* STAGE HISTORY */}
            <div className="card">
              <h2 className="section-title mb-4">Stage History</h2>

              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-2 text-left">Stage</th>
                    <th className="p-2 text-left">Changed By</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {deal.stageHistory?.map((h) => (
                    <tr key={h.id} className="border-t">
                      <td className="p-2">{formatLabel(h.stage)}</td>
                      <td className="p-2">{h.changedBy?.name}</td>
                      <td className="p-2">{formatDate(h.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            <div className="card">
              <h2 className="section-title mb-4">Related</h2>

              <DetailField label="Account">
                <Link to={`/accounts/${deal.account?.id}`} className="link">
                  {deal.account?.accountName}
                </Link>
              </DetailField>

              <DetailField label="Contact">
                {deal.contact?.firstName} {deal.contact?.lastName}
              </DetailField>

              <DetailField label="Owner" value={deal.owner?.name} />
            </div>

          </div>
        </div>
      )}

      {/* ================= TIMELINE ================= */}

      {tab === "timeline" && (
        <div className="card space-y-4">
          {deal.stageHistory?.map((h) => (
            <div key={h.id} className="flex gap-3">

              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />

              <div>
                <p className="text-sm font-medium">
                  Stage changed to {formatLabel(h.stage)}
                </p>

                <p className="text-xs text-gray-500">
                  {h.changedBy?.name} • {formatDate(h.createdAt)}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default DealDetail;
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { fetchDeal, updateDeal, clearCurrentDeal } from "./dealSlice";
// import {
//   STAGE_COLORS,
//   PROGRESS_STAGES,
//   formatCurrency,
//   formatDate,
//   formatLabel,
// } from "../../constants";
// import Spinner from "../../components/Spinner";
// import {
//   CurrencyDollarIcon,
//   PencilSquareIcon,
//   ArrowLeftIcon,
// } from "@heroicons/react/24/outline";

// const DealDetail = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { deal, detailLoading } = useSelector((s) => s.deals);

//   const [tab, setTab] = useState("overview");
//   const [loadingStage, setLoadingStage] = useState(false);

//   useEffect(() => {
//     dispatch(fetchDeal(id));
//     return () => dispatch(clearCurrentDeal());
//   }, [id]);

//   const handleStageChange = async (stage) => {
//     if (stage === deal.stage) return;

//     try {
//       setLoadingStage(true);

//       await dispatch(updateDeal({ id, stage })).unwrap();

//       // refresh with history
//       dispatch(fetchDeal(id));
//     } finally {
//       setLoadingStage(false);
//     }
//   };

//   if (detailLoading || !deal) return <Spinner className="py-20" />;

//   return (
//     <div className="max-w-7xl mx-auto space-y-6">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <ArrowLeftIcon
//             onClick={() => navigate("/deals")}
//             className="w-5 h-5 cursor-pointer text-gray-500"
//           />

//           <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
//             <CurrencyDollarIcon className="w-7 h-7 text-green-600" />
//           </div>

//           <div>
//             <h1 className="text-2xl font-bold">{deal.dealName}</h1>
//             <p className="text-sm text-gray-500">
//               {deal.dealLogId} • {formatCurrency(deal.amount)}
//             </p>
//           </div>
//         </div>

//         <button
//           onClick={() => navigate(`/deals/${id}/edit`)}
//           className="btn-primary"
//         >
//           <PencilSquareIcon className="w-5 h-5 mr-1.5" />
//           Edit
//         </button>
//       </div>

//       {/* STAGE BAR */}
//       <div className="card">
//         <p className="text-xs font-semibold text-gray-500 mb-3">
//           DEAL STAGE
//         </p>

//         <div className="flex flex-wrap gap-2">
//           {PROGRESS_STAGES.map((stage) => (
//             <button
//               key={stage}
//               disabled={loadingStage}
//               onClick={() => handleStageChange(stage)}
//               className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
//                 ${
//                   deal.stage === stage
//                     ? STAGE_COLORS[stage]
//                     : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                 }`}
//             >
//               {formatLabel(stage)}
//             </button>
//           ))}
//         </div>

//         <div className="text-xs text-gray-500 mt-3">
//           Probability: <b>{deal.probability ?? 0}%</b>
//         </div>
//       </div>

//       {/* TABS */}
//       <div className="flex gap-6 border-b text-sm">
//         <button
//           onClick={() => setTab("overview")}
//           className={`pb-2 ${
//             tab === "overview" && "border-b-2 border-blue-600 font-semibold"
//           }`}
//         >
//           Overview
//         </button>

//         <button
//           onClick={() => setTab("timeline")}
//           className={`pb-2 ${
//             tab === "timeline" && "border-b-2 border-blue-600 font-semibold"
//           }`}
//         >
//           Timeline
//         </button>
//       </div>

//       {/* ================= OVERVIEW ================= */}
//       {tab === "overview" && (
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* LEFT */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="card">
//               <h2 className="section-title mb-4">Deal Details</h2>

//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <Field label="Product Group" value={deal.productGroup} />
//                 <Field label="Weightage" value={formatLabel(deal.weightage)} />
//                 <Field label="Closing Date" value={formatDate(deal.closingDate)} />
//                 <Field label="Person In Charge" value={deal.personInCharge} />
//                 <Field label="Next Step" value={deal.nextStep} />
//               </div>
//             </div>

//             {/* STAGE HISTORY TABLE */}
//             <div className="card">
//               <h2 className="section-title mb-4">Stage History</h2>

//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 text-gray-500">
//                   <tr>
//                     <th className="p-2 text-left">Stage</th>
//                     <th className="p-2 text-left">Probability</th>
//                     <th className="p-2 text-left">Changed By</th>
//                     <th className="p-2 text-left">Date</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {deal.stageHistory?.map((h) => (
//                     <tr key={h.id} className="border-t">
//                       <td className="p-2">{formatLabel(h.stage)}</td>
//                       <td className="p-2">{h.probability}%</td>
//                       <td className="p-2">{h.changedBy?.name}</td>
//                       <td className="p-2">{formatDate(h.createdAt)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="space-y-6">
//             <div className="card">
//               <h2 className="section-title mb-4">Related</h2>

//               <Field label="Account">
//                 <Link to={`/accounts/${deal.account?.id}`} className="link">
//                   {deal.account?.accountName}
//                 </Link>
//               </Field>

//               <Field label="Contact">
//                 {deal.contact?.firstName} {deal.contact?.lastName}
//               </Field>

//               <Field label="Owner" value={deal.owner?.name} />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= TIMELINE ================= */}
//       {tab === "timeline" && (
//         <div className="card space-y-4">
//           {deal.stageHistory?.map((h) => (
//             <div key={h.id} className="flex gap-3">
//               <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
//               <div>
//                 <p className="text-sm font-medium">
//                   Stage changed to {formatLabel(h.stage)}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {h.changedBy?.name} • {formatDate(h.createdAt)}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DealDetail;

// /* SMALL FIELD COMPONENT */
// const Field = ({ label, value, children }) => (
//   <div>
//     <p className="text-gray-500 text-xs">{label}</p>
//     <div className="font-medium">{value || children || "-"}</div>
//   </div>
// );
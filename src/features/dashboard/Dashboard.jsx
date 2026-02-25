// import { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { fetchAccounts } from "../accounts/accountSlice";
// import { fetchContacts } from "../contacts/contactSlice";
// import { fetchDeals, fetchPipelineStats } from "../deals/dealSlice";
// import { formatCurrency } from "../../constants";
// import Spinner from "../../components/Spinner";
// import {
//   BuildingOffice2Icon,
//   UserGroupIcon,
//   CurrencyDollarIcon,
//   TrophyIcon,
// } from "@heroicons/react/24/outline";

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const hasFetched = useRef(false);
  
//   const { pagination: accPag, loading: accLoading } = useSelector((s) => s.accounts);
//   const { pagination: conPag, loading: conLoading } = useSelector((s) => s.contacts);
//   const { pagination: dealPag, pipelineStats, loading: dealLoading } = useSelector((s) => s.deals);

//   useEffect(() => {
//     // Only fetch once
//     if (!hasFetched.current) {
//       hasFetched.current = true;
//       dispatch(fetchAccounts({ page: 1, limit: 1 }));
//       dispatch(fetchContacts({ page: 1, limit: 1 }));
//       dispatch(fetchDeals({ page: 1, limit: 1 }));
//       dispatch(fetchPipelineStats());
//     }
//   }, [dispatch]);

//   const isLoading = accLoading || conLoading || dealLoading;

//   const stats = [
//     {
//       label: "Total Accounts",
//       value: accPag?.total ?? "—",
//       icon: BuildingOffice2Icon,
//       lightColor: "bg-blue-100 text-blue-700",
//       link: "/accounts",
//     },
//     {
//       label: "Total Contacts",
//       value: conPag?.total ?? "—",
//       icon: UserGroupIcon,
//       lightColor: "bg-purple-100 text-purple-700",
//       link: "/contacts",
//     },
//     {
//       label: "Total Deals",
//       value: dealPag?.total ?? "—",
//       icon: CurrencyDollarIcon,
//       lightColor: "bg-green-100 text-green-700",
//       link: "/deals",
//     },
//     {
//       label: "Won Revenue",
//       value: pipelineStats?.wonRevenue ? formatCurrency(pipelineStats.wonRevenue) : "—",
//       icon: TrophyIcon,
//       lightColor: "bg-amber-100 text-amber-700",
//       link: "/deals/pipeline",
//     },
//   ];

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="page-title">Dashboard</h1>
//         <p className="text-gray-500 text-sm mt-1">Overview of your CRM data</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat) => (
//           <Link
//             key={stat.label}
//             to={stat.link}
//             className="card hover:shadow-md transition-all group"
//           >
//             <div className="flex items-center justify-between mb-3">
//               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.lightColor}`}>
//                 <stat.icon className="w-5 h-5" />
//               </div>
//             </div>
//             <p className="text-sm text-gray-500">{stat.label}</p>
//             <p className="text-2xl font-bold text-gray-900 mt-1">
//               {isLoading ? <span className="animate-pulse">...</span> : stat.value}
//             </p>
//           </Link>
//         ))}
//       </div>

//       {/* Pipeline Summary */}
//       <div className="card">
//         <h2 className="section-title mb-4">Pipeline Summary</h2>
//         {isLoading ? (
//           <Spinner className="py-8" />
//         ) : pipelineStats?.stages && pipelineStats.stages.length > 0 ? (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {pipelineStats.stages.map((s) => (
//                 <div
//                   key={s.stage}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">
//                       {s.stage.replace(/_/g, " ")}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {s._count.id} deal{s._count.id !== 1 ? "s" : ""}
//                     </p>
//                   </div>
//                   <p className="text-sm font-semibold text-gray-700">
//                     {formatCurrency(s._sum.amount || 0)}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
//               <p className="text-sm font-medium text-gray-500">Total Pipeline Value</p>
//               <p className="text-lg font-bold text-gray-900">
//                 {formatCurrency(pipelineStats.totalRevenue || 0)}
//               </p>
//             </div>
//           </>
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-gray-400 text-sm">No pipeline data yet</p>
//             <Link to="/deals/new" className="link text-sm mt-2 inline-block">
//               Create your first deal
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardAnalytics,
  fetchDealsByStage,
  fetchMonthlyTrend,
  fetchTopPerformers,
  fetchDealsBySource,
} from "../analytics/analyticsSlice";
import { formatCurrency, formatIndianNumber } from "../../constants";
import Spinner from "../../components/Spinner";
import StatCard from "./components/StatCard";
import StageChart from "./components/StageChart";
import MonthlyTrendChart from "./components/MonthlyTrendChart";
import TopPerformers from "./components/TopPerformers";
import DealsClosingSoon from "./components/DealsClosingSoon";
import WinRateGauge from "./components/WinRateGauge";
import LeadSourceChart from "./components/LeadSourceChart";
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const {
    dashboard,
    dealsByStage,
    monthlyTrend,
    topPerformers,
    dealsBySource,
    loading,
  } = useSelector((s) => s.analytics);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchDashboardAnalytics());
      dispatch(fetchDealsByStage());
      dispatch(fetchMonthlyTrend(6));
      dispatch(fetchTopPerformers(5));
      dispatch(fetchDealsBySource());
    }
  }, [dispatch]);

  if (loading && !dashboard) {
    return <Spinner className="py-20" size="lg" />;
  }

  const summary = dashboard?.summary || {};
  const deals = dashboard?.deals || {};
  const thisMonth = dashboard?.thisMonth || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's what's happening with your sales.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pipeline"
          value={formatIndianNumber(summary.totalPipelineValue)}
          subtitle={`${summary.totalDeals || 0} deals`}
          icon={CurrencyRupeeIcon}
          color="blue"
          onClick={() => navigate("/deals")}
        />
        <StatCard
          title="Won Revenue"
          value={formatIndianNumber(deals.won?.amount)}
          subtitle={`${deals.won?.count || 0} deals closed`}
          icon={TrophyIcon}
          color="green"
          onClick={() => navigate("/deals?stage=CLOSED_WON")}
        />
        <StatCard
          title="Open Deals"
          value={formatIndianNumber(deals.open?.amount)}
          subtitle={`${deals.open?.count || 0} active deals`}
          icon={ClipboardDocumentListIcon}
          color="purple"
          onClick={() => navigate("/deals")}
        />
        <StatCard
          title="This Month"
          value={formatIndianNumber(thisMonth.wonAmount)}
          subtitle={`${thisMonth.wonDeals || 0} deals won`}
          trend={thisMonth.growth}
          trendLabel="vs last month"
          icon={ArrowTrendingUpIcon}
          color="amber"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          className="card py-4 cursor-pointer hover:shadow-md transition-all"
          onClick={() => navigate("/accounts")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BuildingOffice2Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {summary.totalAccounts || 0}
              </p>
              <p className="text-xs text-gray-500">Accounts</p>
            </div>
          </div>
        </div>

        <div
          className="card py-4 cursor-pointer hover:shadow-md transition-all"
          onClick={() => navigate("/contacts")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {summary.totalContacts || 0}
              </p>
              <p className="text-xs text-gray-500">Contacts</p>
            </div>
          </div>
        </div>

        <div className="card py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BanknotesIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatIndianNumber(summary.averageDealSize)}
              </p>
              <p className="text-xs text-gray-500">Avg Deal Size</p>
            </div>
          </div>
        </div>

        <div
          className="card py-4 cursor-pointer hover:shadow-md transition-all"
          onClick={() => navigate("/deals/pipeline")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {summary.averageProbability || 0}%
              </p>
              <p className="text-xs text-gray-500">Avg Probability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyTrendChart data={monthlyTrend} />
        </div>
        <div>
          <WinRateGauge
            winRate={deals.winRate || 0}
            wonDeals={deals.won?.count || 0}
            lostDeals={deals.lost?.count || 0}
            openDeals={deals.open?.count || 0}
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StageChart data={dealsByStage} />
        <LeadSourceChart data={dealsBySource} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DealsClosingSoon deals={dashboard?.dealsClosingThisMonth} />
        <TopPerformers data={topPerformers} />
      </div>
    </div>
  );
};

export default Dashboard;
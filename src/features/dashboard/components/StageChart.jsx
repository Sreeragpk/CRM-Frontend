import { formatCurrency, formatLabel, STAGE_COLORS } from "../../../constants";

const StageChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="section-title mb-4">Deals by Stage</h3>
        <p className="text-gray-400 text-sm text-center py-8">No data available</p>
      </div>
    );
  }

  const maxAmount = Math.max(...data.map((d) => d.amount || 0), 1);
  const totalDeals = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">Deals by Stage</h3>
        <span className="text-sm text-gray-500">{totalDeals} total deals</span>
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
          const colorClass = STAGE_COLORS[item.stage] || "bg-gray-100 text-gray-800";
          const bgColor = colorClass.replace("text-", "bg-").split(" ")[0].replace("bg-", "");

          return (
            <div key={item.stage} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`badge text-[10px] ${colorClass}`}>
                    {item.count}
                  </span>
                  <span className="text-sm text-gray-700">
                    {formatLabel(item.stage)}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 bg-${bgColor.replace("-100", "-500")}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StageChart;
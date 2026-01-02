import { Clock, User, ArrowRight } from "lucide-react";

interface Props {
  history: {
    from: string | null;
    to: string;
    changedBy: string;
    changedAt: string;
  }[];
}

const ComplaintTimeline = ({ history }: Props) => {
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      SUBMITTED: "bg-blue-500",
      IN_PROGRESS: "bg-[#0fc9e7]",
      RESOLVED: "bg-green-500",
      REOPENED: "bg-orange-500",
      CLOSED: "bg-gray-500"
    };
    return statusMap[status] || "bg-gray-400";
  };

  const getStatusBgColor = (status: string) => {
    const statusMap: Record<string, string> = {
      SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
      IN_PROGRESS: "bg-cyan-50 text-[#0fc9e7] border-cyan-200",
      RESOLVED: "bg-green-50 text-green-700 border-green-200",
      REOPENED: "bg-orange-50 text-orange-700 border-orange-200",
      CLOSED: "bg-gray-100 text-gray-700 border-gray-300"
    };
    return statusMap[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <div className="space-y-6">
      {history.map((item, index) => (
        <div key={index} className="flex gap-4 group">
          {/* Left timeline indicator */}
          <div className="flex flex-col items-center pt-1">
            <div className={`h-4 w-4 rounded-full ${getStatusColor(item.to)} ring-4 ring-white shadow-lg group-hover:scale-125 transition-transform`} />
            {index !== history.length - 1 && (
              <div className="flex-1 w-0.5 bg-linear-to-b from-gray-300 to-transparent mt-2 min-h-12" />
            )}
          </div>

          {/* Right content card */}
          <div className="flex-1 pb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0fc9e7] transition-all">
              
              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-3">
                {item.from && (
                  <>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusBgColor(item.from)}`}>
                      {item.from.replace("_", " ")}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </>
                )}
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusBgColor(item.to)}`}>
                  {item.to.replace("_", " ")}
                </span>
              </div>

              {/* Changed by */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <User className="h-4 w-4 text-[#4756ca]" />
                <span className="font-semibold text-gray-700">Changed by:</span>
                <span>{item.changedBy}</span>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                {new Date(item.changedAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintTimeline;
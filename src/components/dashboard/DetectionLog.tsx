import React, { useState } from 'react';
import { useDevice } from '../../context/DeviceContext';
import { 
  Bug, 
  Trash2, 
  Download, 
  Clock, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Filter
} from 'lucide-react';

export const DetectionLog: React.FC = () => {
  const { detectionHistory, clearDetectionLog } = useDevice();
  const [filterBphOnly, setFilterBphOnly] = useState<boolean>(false);

  const filteredLogs = detectionHistory.filter((item) => {
    if (filterBphOnly) return String(item.pestType).toLowerCase().includes('planthopper');
    return true;
  });

  const exportLogsAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(detectionHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ecoecho_field_log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-app-border shadow-sm space-y-3.5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-black text-forest-950 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-forest-700" />
              Recent Field Protection Activity
            </h3>
            <span className="bg-forest-100 text-forest-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {detectionHistory.length} Events
            </span>
          </div>
          <p className="text-xs text-forest-700/80 mt-0.5">
            Log of pests spotted by camera vision and repelled by acoustic sound waves.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          
          {/* Filter Pill */}
          <button
            onClick={() => setFilterBphOnly(!filterBphOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border ${
              filterBphOnly 
                ? 'bg-forest-900 text-white border-forest-900 shadow-xs' 
                : 'bg-forest-50 hover:bg-forest-100 text-forest-800 border-forest-200'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>{filterBphOnly ? 'Showing Planthoppers' : 'All Insects'}</span>
          </button>

          {/* Export button */}
          <button
            onClick={exportLogsAsJson}
            disabled={detectionHistory.length === 0}
            className="p-2 bg-forest-50 hover:bg-forest-100 text-forest-700 rounded-xl border border-forest-200 transition-colors cursor-pointer disabled:opacity-40"
            title="Download Field Activity Log"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Clear button */}
          <button
            onClick={clearDetectionLog}
            disabled={detectionHistory.length === 0}
            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-colors cursor-pointer disabled:opacity-40"
            title="Clear Activity List"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center bg-forest-50/50 rounded-2xl border border-dashed border-forest-200 text-forest-600 space-y-1">
            <ShieldCheck className="w-8 h-8 mx-auto text-emerald-600 opacity-80" />
            <p className="text-xs font-bold text-forest-900">No pest detections recorded yet</p>
            <p className="text-[11px] text-forest-600 max-w-xs mx-auto">
              EcoEcho is monitoring the crop canopy. When insects are detected, repelling actions will appear here.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isBPH = String(log.pestType).toLowerCase().includes('planthopper');
            return (
              <div
                key={log.id}
                className="bg-forest-50/70 hover:bg-forest-50 border border-forest-200/80 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
              >
                {/* Left: Pest name & time */}
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isBPH 
                      ? 'bg-amber-500 text-forest-950 font-bold' 
                      : 'bg-emerald-500 text-forest-950 font-bold'
                  }`}>
                    <Bug className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-black text-forest-950">{log.pestType}</h4>
                      <span className="text-[10px] text-forest-600">({(log.confidence * 100).toFixed(0)}% Match)</span>
                    </div>
                    <div className="text-[11px] text-forest-600 font-mono mt-0.5">
                      Spotted at {log.timestamp} • Field Canopy
                    </div>
                  </div>
                </div>

                {/* Right: Deterrent Action */}
                <div className="flex items-center justify-between sm:justify-end space-x-2.5">
                  <div className="flex items-center space-x-1 text-xs font-bold text-forest-900">
                    <Zap className="w-3.5 h-3.5 text-solar-500" />
                    <span>Acoustic Wave Fired</span>
                  </div>

                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Repelled</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

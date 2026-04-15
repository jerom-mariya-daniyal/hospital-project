import { useState } from "react";
import axios from "axios";
import { 
  UploadCloud, 
  CheckCircle, 
  Loader2, 
  FileText, 
  X,
  Plus,
  Info
} from "lucide-react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function StaffDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("General");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const uploadedUrls: string[] = [];

      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append("image", file);
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        uploadedUrls.push(uploadRes.data.url);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/activities`,
        { title, description, images: uploadedUrls, tag },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setTitle("");
      setDescription("");
      setTag("General");
      setImageFiles([]);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to submit activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-slate-900 rounded-xl text-white shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">New Activity Report</h1>
        </div>
        <p className="text-slate-500 text-sm sm:text-base font-medium mt-1 ml-1">Document your veterinary circle's work for the public portal.</p>
      </div>

      {/* Success message */}
      {success && (
        <div className="flex items-start gap-4 bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
          <div className="p-2 bg-emerald-500 rounded-xl text-white shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-900 text-base">Successfully Recorded</h3>
            <p className="text-emerald-700 text-sm mt-0.5">Your report has been queued for administrative review.</p>
            <button onClick={() => setSuccess(false)} className="mt-2 text-emerald-900 font-bold text-sm hover:underline">
              Submit another report?
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
          <span className="text-base shrink-0">⚠️</span>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Report Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 text-base font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              placeholder="e.g. Annual Herd Inspection – Sector 4"
            />
          </div>

          {/* Category Tag */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Activity Category</label>
            <div className="flex flex-wrap gap-2">
              {["Vaccination", "Emergency", "Checkup", "Inspection", "Campaign", "General"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                    tag === t
                      ? "bg-slate-900 border-slate-900 text-white shadow-md"
                      : "border-slate-200 text-slate-500 hover:border-slate-700 hover:text-slate-800 bg-slate-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Description (Rich Text) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Detailed Narrative</label>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                placeholder="Record your findings, observations, and actions taken..."
              />
            </div>
          </div>

          {/* Image upload */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Visual Evidence</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {imageFiles.map((file, idx) => (
                <div key={idx} className="aspect-square relative rounded-xl overflow-hidden group bg-slate-100 border border-slate-200">
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute inset-0 flex items-center justify-center bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}

              <label className="aspect-square cursor-pointer bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center hover:bg-slate-100 hover:border-slate-400 transition-all group">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                <Plus className="w-6 h-6 text-slate-400 group-hover:text-slate-700 transition-colors" />
                <span className="text-slate-400 font-medium text-[11px] mt-1.5 tracking-wide">Add Photo</span>
              </label>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              Reports with clear photos are reviewed faster.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 px-6 rounded-xl text-base font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-lg active:scale-[0.99] disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 className="animate-spin mr-2.5 h-5 w-5" />Uploading & Submitting...</>
            ) : (
              <><UploadCloud className="w-5 h-5 mr-2.5" />Submit Report for Review</>
            )}
          </button>
        </form>
      </div>

      {/* Tips card */}
      <div className="bg-slate-900 p-5 sm:p-6 rounded-2xl text-white">
        <h4 className="font-bold text-sm uppercase tracking-widest text-blue-400 mb-3">Submission Guidelines</h4>
        <ul className="space-y-2.5">
          {[
            "Use professional terminology throughout the narrative.",
            "Upload high-resolution, relevant photos only.",
            "Double-check the report title before submitting.",
            "Reports cannot be edited after submission.",
          ].map((item, i) => (
            <li key={i} className="flex items-start text-slate-300 text-sm">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2.5 mt-1.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { Download, Award, CheckCircle } from "lucide-react";
import { STORAGE_KEYS } from "../../constants";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Certificate {
  _id: string;
  course: {
    _id: string;
    title: string;
    language: string;
    category: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  certificateNumber: string;
  finalScore: number;
  approvalStatus: "pending" | "approved" | "rejected";
  approvalDate: string;
  createdAt: string;
}

export default function UserCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const LIMIT = 6;

  const loadCertificates = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `${API_BASE_URL}/profile/certificates?page=${page}&limit=${LIMIT}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || ""}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setCertificates(data.data);
        setTotal(data.total);
      } else {
        setError(data.message || "Failed to load certificates");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Certificate loading error:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadCertificates();
  }, [page, loadCertificates]);

  const downloadCertificate = async (certificateId: string) => {
    try {
      setDownloadingId(certificateId);
      console.log('Starting certificate download for:', certificateId);
      
      // Use direct link download instead of fetch to avoid ad blocker issues
      const downloadUrl = `${API_BASE_URL}/profile/certificates/${certificateId}/download?token=${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`;
      console.log('Download URL:', downloadUrl);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `certificate_${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
      console.log('Download initiated successfully');
    } catch (err) {
      console.error("Download error details:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading && certificates.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && certificates.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {certificates.length === 0 ? (
        <div className="text-center py-8">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No certificates earned yet</p>
          <p className="text-gray-500 text-sm">
            Complete and get approval for courses to earn certificates
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert: Certificate) => (
              <div
                key={cert._id}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {/* Certificate Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {cert.course?.title || "Unknown Course"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Certificate of Completion
                      </p>
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-amber-500" />
                </div>

                {/* Certificate Details */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Certificate Number:</span>
                    <span className="font-mono text-gray-900">
                      {cert.certificateNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Final Score:</span>
                    <span className="font-semibold text-blue-600">
                      {cert.finalScore}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Issued Date:</span>
                    <span className="text-gray-900">
                      {new Date(cert.approvalDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => downloadCertificate(cert._id)}
                  disabled={downloadingId === cert._id}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {downloadingId === cert._id
                    ? "Downloading..."
                    : "Download PDF"}
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {Math.ceil(total / LIMIT) > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {page} of {Math.ceil(total / LIMIT)}
              </span>
              <button
                onClick={() =>
                  setPage(Math.min(Math.ceil(total / LIMIT), page + 1))
                }
                disabled={page === Math.ceil(total / LIMIT)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

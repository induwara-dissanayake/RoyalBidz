import React, { useState, useEffect } from "react";
import {
  Share2,
  TrendingUp,
  Users,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  BarChart3,
} from "lucide-react";

const SocialShareAnalytics = () => {
  const [shareStats, setShareStats] = useState([]);
  const [totalShares, setTotalShares] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShareAnalytics();
  }, []);

  const fetchShareAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch share stats
      const statsResponse = await fetch("/api/socialshare/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch total count
      const countResponse = await fetch("/api/socialshare/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (statsResponse.ok && countResponse.ok) {
        const stats = await statsResponse.json();
        const count = await countResponse.json();

        setShareStats(stats);
        setTotalShares(count);
      }
    } catch (error) {
      console.error("Error fetching social share analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "whatsapp":
        return <MessageCircle size={20} className="text-green-500" />;
      case "facebook":
        return <Facebook size={20} className="text-blue-600" />;
      case "twitter":
        return <Twitter size={20} className="text-blue-400" />;
      case "instagram":
        return <Instagram size={20} className="text-pink-500" />;
      default:
        return <Share2 size={20} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>
            <Share2 size={24} /> Social Share Analytics
          </h2>
        </div>
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>
          <Share2 size={24} /> Social Share Analytics
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="analytics-grid">
        <div className="analytics-card total-shares">
          <div className="card-icon">
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <h3>Total Shares</h3>
            <p className="stat-number">{totalShares.toLocaleString()}</p>
          </div>
        </div>

        <div className="analytics-card platforms">
          <div className="card-icon">
            <BarChart3 size={24} />
          </div>
          <div className="card-content">
            <h3>Active Platforms</h3>
            <p className="stat-number">{shareStats.length}</p>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="platform-breakdown">
        <h3>Platform Breakdown</h3>
        <div className="platform-stats">
          {shareStats.map((stat) => (
            <div key={stat.platform} className="platform-stat-card">
              <div className="platform-header">
                {getPlatformIcon(stat.platform)}
                <span className="platform-name">{stat.platform}</span>
              </div>

              <div className="platform-metrics">
                <div className="metric">
                  <span className="metric-label">Total Shares:</span>
                  <span className="metric-value">{stat.shareCount}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Auction Shares:</span>
                  <span className="metric-value">{stat.auctionShares}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Win Shares:</span>
                  <span className="metric-value">{stat.winShares}</span>
                </div>
              </div>

              <div className="share-progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${
                      totalShares > 0
                        ? (stat.shareCount / totalShares) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .admin-section {
          padding: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .section-header h2 {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 24px 0;
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .analytics-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .card-icon {
          padding: 12px;
          background: #e0af62;
          border-radius: 10px;
          color: white;
        }

        .card-content h3 {
          margin: 0 0 4px 0;
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-number {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .platform-breakdown h3 {
          margin: 0 0 20px 0;
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .platform-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .platform-stat-card {
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: white;
        }

        .platform-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .platform-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          text-transform: capitalize;
        }

        .platform-metrics {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .metric-label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .metric-value {
          font-weight: 600;
          color: #1f2937;
        }

        .share-progress {
          height: 4px;
          background: #f3f4f6;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #e0af62, #d4a455);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default SocialShareAnalytics;

import { useEffect, useState } from "react";

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/admin/opportunities", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setOpportunities(Array.isArray(data) ? data : data.opportunities || []);
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <>
      <div className="page-card">
        <h1 className="page-title">Opportunities</h1>
        <p className="page-subtitle">All company and expert opportunities.</p>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Opportunity List</h2>
        </div>

        {loading ? (
          <p>Loading opportunities...</p>
        ) : (
          <div className="opportunity-list">
            {opportunities.length > 0 ? (
              opportunities.map((item, index) => (
                <div className="opportunity-card" key={item._id || item.id || index}>
                  <div className="opportunity-header">
                    <div>
                      <h3>{item.title || "Untitled Opportunity"}</h3>
                      <p className="muted">{item.companyName || item.company || "Unknown company"}</p>
                      <p className="small-muted">{item.description || "No description available"}</p>
                    </div>
                    <div className="small-muted">{item.status || "Open"}</div>
                  </div>
                </div>
              ))
            ) : (
              <p>No opportunities found.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
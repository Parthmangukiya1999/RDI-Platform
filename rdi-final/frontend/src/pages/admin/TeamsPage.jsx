import { useEffect, useState } from "react";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/admin/teams", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setTeams(Array.isArray(data) ? data : data.teams || []);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <>
      <div className="page-card">
        <h1 className="page-title">Teams</h1>
        <p className="page-subtitle">Manage all student teams.</p>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Team List</h2>
        </div>

        {loading ? (
          <p>Loading teams...</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Members</th>
                  <th>Project</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teams.length > 0 ? (
                  teams.map((team, index) => (
                    <tr key={team._id || team.id || index}>
                      <td>{team.name || "Unnamed Team"}</td>
                      <td>
                        {Array.isArray(team.members)
                          ? team.members.length
                          : team.memberCount || 0}
                      </td>
                      <td>{team.projectName || team.project || "N/A"}</td>
                      <td>{team.status || "Active"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No teams found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
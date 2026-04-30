import { useEffect, useMemo, useState } from "react";
import {
  getProjects,
  removeMemberFromProject,
  leaveProject,
} from "../../services/projectService";
import "./student.css";

export default function TeamPage() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const myProjects = useMemo(() => {
    if (!user?._id) return [];

    return projects.filter((project) => {
      const isOwner =
        project?.createdBy?._id === user._id ||
        project?.createdBy === user._id;

      const isMember = Array.isArray(project?.members)
        ? project.members.some(
            (member) =>
              member?.user?._id === user._id ||
              member?.user === user._id
          )
        : false;

      return isOwner || isMember;
    });
  }, [projects, user]);

  const rows = useMemo(() => {
    const result = [];

    myProjects.forEach((project) => {
      const ownerId = project?.createdBy?._id || project?.createdBy;

      result.push({
        key: `${project._id}-leader`,
        projectId: project._id,
        userId: ownerId,
        name: project?.createdBy?.name || "Project Leader",
        email: project?.createdBy?.email || "-",
        projectTitle: project?.title || "-",
        role: "Leader",
        status: project?.status || "-",
        isLeader: true,
        isCurrentUser: ownerId === user?._id,
      });

      (project.members || []).forEach((member, index) => {
        const memberId = member?.user?._id || member?.user;

        result.push({
          key: `${project._id}-member-${memberId || index}`,
          projectId: project._id,
          userId: memberId,
          name: member?.user?.name || "Member",
          email: member?.user?.email || "-",
          projectTitle: project?.title || "-",
          role: member?.role || "Member",
          status: project?.status || "-",
          isLeader: false,
          isCurrentUser: memberId === user?._id,
          projectOwnerId: ownerId,
        });
      });
    });

    return result;
  }, [myProjects, user]);

  const handleRemove = async (projectId, memberUserId) => {
    try {
      await removeMemberFromProject(projectId, memberUserId);
      await loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove member");
    }
  };

  const handleLeave = async (projectId) => {
    try {
      await leaveProject(projectId);
      await loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave project");
    }
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">Team Members</h2>
      </div>

      {error && <div style={{ color: "#b91c1c", marginBottom: "12px" }}>{error}</div>}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Project</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="small-muted">
                  Loading team data...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="6" className="small-muted">
                  No team records found.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isProjectOwner = row.projectOwnerId === user?._id;
                const canRemove =
                  !row.isLeader && isProjectOwner && !row.isCurrentUser;
                const canLeave = !row.isLeader && row.isCurrentUser;

                return (
                  <tr key={row.key}>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.projectTitle}</td>
                    <td>{row.role}</td>
                    <td>{row.status}</td>
                    <td style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {row.isLeader ? (
                        <button className="btn" disabled>
                          Leader
                        </button>
                      ) : (
                        <>
                          <button
                            className="btn"
                            type="button"
                            disabled={!canRemove}
                            onClick={() => handleRemove(row.projectId, row.userId)}
                          >
                            Remove
                          </button>

                          <button
                            className="btn"
                            type="button"
                            disabled={!canLeave}
                            onClick={() => handleLeave(row.projectId)}
                          >
                            Leave
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import { useMemo, useState, memo } from "react";
import "./index.css";

const departments = ["All", "IT", "HR", "Finance", "Marketing", "Sales"];

const employees = Array.from({ length: 1500 }, (_, index) => {
  const names = ["Ali Ahmed", "Sara Khan", "Usman Malik", "Ayesha Noor", "Hamza Shah", "Fatima Iqbal", "Bilal Hussain", "Zainab Ali"];
  const roles = ["Software Developer", "UI/UX Designer", "HR Manager", "Accountant", "Marketing Executive", "Sales Officer"];
  const department = departments[1 + (index % 5)];

  return {
    id: index + 1,
    name: `${names[index % names.length]} ${index + 1}`,
    email: `employee${index + 1}@company.com`,
    department,
    role: roles[index % roles.length],
    salary: 40000 + ((index * 1379) % 110000),
  };
});

const EmployeeRow = memo(function EmployeeRow({ employee }) {
  return (
    <tr>
      <td>
        <div className="employee-name">
          <div className="avatar">{employee.name.charAt(0)}</div>
          <div>
            <strong>{employee.name}</strong>
            <span className="employee-id">ID: {employee.id}</span>
          </div>
        </div>
      </td>
      <td>{employee.email}</td>
      <td><span className="department">{employee.department}</span></td>
      <td>{employee.role}</td>
      <td className="salary">Rs. {employee.salary.toLocaleString("en-PK")}</td>
    </tr>
  );
});

function App() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All" || employee.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [search, department]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visibleEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const changeDepartment = (value) => {
    setDepartment(value);
    setPage(1);
  };

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">DAY 22 · REACT PERFORMANCE</p>
          <h1>Employee Dashboard</h1>
          <p className="subtitle">Manage your workforce in one place.</p>
        </div>
        <div className="status"><span /> System Active</div>
      </header>

      <section className="stats">
        <article className="stat-card">
          <span className="stat-icon blue">♙</span>
          <p>Total Employees</p>
          <h2>{employees.length.toLocaleString()}</h2>
          <small>Records in the dataset</small>
        </article>
        <article className="stat-card">
          <span className="stat-icon green">✓</span>
          <p>Matching Records</p>
          <h2>{filteredEmployees.length.toLocaleString()}</h2>
          <small>Based on current filters</small>
        </article>
        <article className="stat-card">
          <span className="stat-icon purple">ϟ</span>
          <p>Rows Per Page</p>
          <h2>{pageSize}</h2>
          <small>Rendered in the table</small>
        </article>
      </section>

      <section className="table-card">
        <div className="table-heading">
          <div>
            <h2>Employee Records</h2>
            <p>Search, filter and explore employee details.</p>
          </div>
          <span className="record-count">{filteredEmployees.length} records</span>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search name, email or role..."
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
            />
          </div>

          <select
            value={department}
            onChange={(event) => changeDepartment(event.target.value)}
            aria-label="Filter by department"
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Departments" : item}
              </option>
            ))}
          </select>

          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            aria-label="Rows per page"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>EMAIL</th>
                <th>DEPARTMENT</th>
                <th>ROLE</th>
                <th>SALARY</th>
              </tr>
            </thead>
            <tbody>
              {visibleEmployees.map((employee) => (
                <EmployeeRow key={employee.id} employee={employee} />
              ))}
              {visibleEmployees.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No employees found. Try another search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="pagination">
          <span>
            Showing {filteredEmployees.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            {"–"}
            {Math.min(currentPage * pageSize, filteredEmployees.length)}
            {" "}of {filteredEmployees.length} records
          </span>
          <div className="page-controls">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            <span className="page-number">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </footer>
      </section>

      <p className="footer-note">
        Built with React · useMemo · React.memo · Pagination
      </p>
    </main>
  );
}

export default App;
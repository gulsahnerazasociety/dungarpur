import { useEffect, useState } from "react";

export default function Participants() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("");

  const sheetURL =
    "https://script.google.com/macros/s/AKfycbzWCl0rVamP8RsuCBr_dyW02735dbMMTlFinEcpgeZ5Oy2TP0lyigS6d8nv6GCjK10P/exec?action=getAll";

  useEffect(() => {
    fetch(sheetURL)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


  const filtered = data.filter((item) => {
    return (
      (item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.formNo.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.includes(search)) &&
      (filterGroup === "" || item.ageGroup === filterGroup)
    );
  });

  return (
    <div className="participant-box">

      <h1>Registered Participants</h1>
      <p>गुलशन-ए-रज़ा सोसाइटी – Quiz / Islamic Competition</p>

      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          {/* Search */}
          <input
            className="search"
            placeholder="Search by Name / Form No / Phone"
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Filter */}
          <select className="search" onChange={(e) => setFilterGroup(e.target.value)}>
            <option value="">All Groups</option>
            <option value="Group A">Group A</option>
            <option value="Group B">Group B</option>
            <option value="Group C">Group C</option>
            <option value="Group D">Group D</option>
          </select>

          {/* Table */}
          <div className="table-area">
            <table>
              <thead>
                <tr>
                  <th>Form No</th>
                  <th>Name</th>
                  <th>Father</th>
                  <th>Age</th>
                  <th>Group</th>
                  <th>Competition</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i}>
                    <td>{row.formNo}</td>
                    <td>{row.name}</td>
                    <td>{row.father}</td>
                    <td>{row.age}</td>
                    <td>{row.ageGroup}</td>
                    <td>{row.competition}</td>
                    <td className={row.status === "Paid" ? "paid" : "pending"}>
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

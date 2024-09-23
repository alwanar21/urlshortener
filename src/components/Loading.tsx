import { useSearchParams } from "react-router-dom";

export default function Loading() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  return (
    <div className="overflow-x-auto mb-4">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Shorcut</th>
            <th>Visit Count</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div className="flex items-center py-11 justify-center mt-4">
        <span className="loading loading-bars loading-lg px-auto"></span>
      </div>
      <div className="flex justify-center items-center">
        <div className="join">
          <button className="join-item btn btn-disabled">«</button>
          <button className="join-item btn btn-disabled">Page {Number(page) || "-"}</button>
          <button className="join-item btn btn-disabled">»</button>
        </div>
      </div>
    </div>
  );
}

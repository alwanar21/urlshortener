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
        <tbody>
          <tr>
            <td>
              <div className="skeleton h-6 w-6 rounded-lg"></div>
            </td>
            <td>
              <div className="skeleton h-6 w-32 rounded-lg"></div>
            </td>
            <td>
              <div className="skeleton h-6 w-44 rounded-lg"></div>
            </td>
            <td>
              <div className="skeleton h-6 w-6 rounded-lg"></div>
            </td>
            <td>
              <div className="skeleton h-6 w-20 rounded-lg"></div>
            </td>
            <td>
              <div className="flex gap-2">
                <div className="skeleton h-6 w-16 rounded-lg"></div>
                <div className="skeleton h-6 w-16 rounded-lg"></div>
                <div className="skeleton h-6 w-16 rounded-lg"></div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="skeleton h-6 w-6 rounded-lg"></div>
            </td>
            <td>
              <div className="skeleton h-6 w-32 rounded-lg"></div>
            </td>
            <td>
              <div className="skeleton h-6 w-44 rounded-lg"></div>
            </td>
            <td>
              <div className="skeleton h-6 w-6 rounded-lg"></div>
            </td>
            <td>
              <div className="skeleton h-6 w-20 rounded-lg"></div>
            </td>
            <td>
              <div className="flex gap-2">
                <div className="skeleton h-6 w-16 rounded-lg"></div>
                <div className="skeleton h-6 w-16 rounded-lg"></div>
                <div className="skeleton h-6 w-16 rounded-lg"></div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="skeleton h-6 w-6 rounded-lg"></div>
            </td>
            <td>
              <div className="skeleton h-6 w-32 rounded-lg"></div>
            </td>
            <td>
              <div className="skeleton h-6 w-44 rounded-lg"></div>
            </td>
            <td>
              <div className="skeleton h-6 w-6 rounded-lg"></div>
            </td>
            <td>
              <div className="skeleton h-6 w-20 rounded-lg"></div>
            </td>
            <td>
              <div className="flex gap-2">
                <div className="skeleton h-6 w-16 rounded-lg"></div>
                <div className="skeleton h-6 w-16 rounded-lg"></div>
                <div className="skeleton h-6 w-16 rounded-lg"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-3">
        <div className="join">
          <button className="join-item btn btn-disabled">«</button>
          <button className="join-item btn btn-disabled">Page {Number(page) || "-"}</button>
          <button className="join-item btn btn-disabled">»</button>
        </div>
      </div>
    </div>
  );
}

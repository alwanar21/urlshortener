import { BiTaskX } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";

interface EmptyProps {
  message?: string;
}

export default function Empty({ message = "Data Not found" }: EmptyProps) {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const navigate = useNavigate();

  return (
    <>
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
        <div className="w-full flex flex-col gap-4 items-center py-16">
          <BiTaskX className="text-7xl" />
          <p className="text-xl sm:text-2xl font-semibold text-center">{message}</p>
          {page !== "1" && (
            <button className="btn btn-sm" onClick={() => navigate("/dashboard")}>
              Back to Page 1
            </button>
          )}
        </div>
      </div>
    </>
  );
}

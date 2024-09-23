import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAll, remove, updateStatus } from "../../service/url-service";
import Empty from "./Empty";
import Loading from "../Loading";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useState } from "react";

interface Urltype {
  id: number;
  name: string;
  shortURL: string;
  redirectURL: string;
  visitCount: number;
  status: "ACTIVE" | "INACTIVE";
  lastVisit: string | null;
  createdAt: string;
}

export default function Urls() {
  const [userId, setUserId] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteModal = document.getElementById("modal_delete") as HTMLDialogElement;
  const openModalDelete = (id: number) => {
    setUserId(id);
    if (deleteModal) {
      deleteModal.showModal();
    }
  };

  async function copyTextToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success("Link copied");
  }

  const updateStatusMutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["urls", page] });
      toast.success(data?.message);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      }
    },
  });

  const deleteUrlMutation = useMutation({
    mutationFn: remove,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["urls", page] });
      toast.success(data?.message);
      deleteModal.close();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      }
    },
  });

  const { data: urls, isLoading } = useQuery({
    queryKey: ["urls", page],
    queryFn: () => getAll(page),
  });

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* table */}
          {urls?.data?.length >= 1 ? (
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
                  {urls.data.map((url: Urltype, index: number) => (
                    <tr key={url.id}>
                      <th>{urls.pagination.currentPage * 5 - 5 + index + 1}</th>
                      <td>{url.name}</td>
                      <td>{url.shortURL}</td>
                      <td>{url.visitCount}</td>
                      <td>
                        <button
                          className={`btn btn-primary btn-sm ${
                            updateStatusMutation.isPending && "btn-disabled"
                          } tooltip`}
                          data-tip="change status"
                          onClick={() => updateStatusMutation.mutate(url.id)}
                        >
                          {url.status}
                        </button>
                      </td>
                      <td className="flex flex-row gap-2">
                        <button
                          onClick={() => copyTextToClipboard(url.shortURL)}
                          className="btn btn-info btn-sm text-white"
                        >
                          copy link
                        </button>
                        <button className="btn btn-warning btn-sm text-white">change</button>
                        <button className="btn btn-error btn-sm text-white" onClick={() => openModalDelete(url.id)}>
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty message={urls?.message} />
          )}
          {/* pagination */}
          <div className="flex justify-center items-center">
            {urls?.pagination ? (
              <div className="join">
                <button
                  className={`join-item btn ${urls.pagination.previousPage == null ? "btn-disabled" : ""}`}
                  onClick={() => navigate(`/dashboard?page=${urls.pagination.currentPage - 1}`)}
                >
                  «
                </button>
                <button className="join-item btn">Page {urls.pagination.currentPage}</button>
                <button
                  className={`join-item btn ${urls.pagination.nextPage == null ? "btn-disabled" : ""}`}
                  onClick={() => navigate(`/dashboard?page=${urls.pagination.currentPage + 1}`)}
                >
                  »
                </button>
              </div>
            ) : (
              <div className="join">
                <button className="join-item btn btn-disabled">«</button>
                <button className="join-item btn btn-disabled">Page Not Found</button>
                <button className="join-item btn btn-disabled">»</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* modal delete */}
      <dialog id="modal_delete" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <p className="py-4 text-xl">Are you sure you want to delete this data?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className={`btn ${deleteUrlMutation.isPending && "btn-disabled"}`}>Close</button>
            </form>
            <button
              onClick={() => deleteUrlMutation.mutate(userId ?? 0)}
              className={`btn btn-error text-white ${deleteUrlMutation.isPending && "btn-disabled"}`}
            >
              Yes
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

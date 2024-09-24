import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get, getAll, remove, update, updateStatus } from "../../service/url-service";
import Empty from "./Empty";
import Loading from "../Loading";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUrlValidation } from "../../validation/url-validation";
import { z } from "zod";
import { formatZodErrors } from "../../utils/zodError";

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
  const [urlForDelete, setUrlForDelete] = useState<number>(0);
  const [urlId, setUrlId] = useState<number>(0);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  type updateUrlType = z.infer<typeof updateUrlValidation>;

  const updateModal = document.getElementById("modal_update_url") as HTMLDialogElement;
  const deleteModal = document.getElementById("modal_delete") as HTMLDialogElement;
  const openModalDelete = (id: number) => {
    setUrlForDelete(id);
    if (deleteModal) {
      deleteModal.showModal();
    }
  };

  const openModalUpdate = (id: number) => {
    setUrlId(id);
    if (updateModal) {
      updateModal.showModal();
      if (urlId !== id) {
        reset();
      }
    }
  };

  const closeModalUpdate = () => {
    deleteModal.close();
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

  const updateUrlMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: updateUrlType }) => update(id, body),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["urls", page] });
      updateModal.close();
      reset();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.data?.errors) {
          const formattedErrors = formatZodErrors(error.response?.data);
          setError("name", formattedErrors.name);
        } else {
          const errorMessage = error.response?.data?.message || "An unknown error occurred";
          toast.error(errorMessage);
          updateModal.close();
          reset();
        }
      } else {
        console.log(error.message);
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

  const getUrlQuery = useQuery({
    queryKey: ["url", urlId],
    queryFn: () => get(urlId ?? 0),
    enabled: false,
    retry: false,
  });

  const { data: urls, isLoading } = useQuery({
    queryKey: ["urls", page],
    queryFn: () => getAll(page),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm<updateUrlType>({
    resolver: zodResolver(updateUrlValidation),
  });
  const onSubmit: SubmitHandler<updateUrlType> = (data) => {
    updateUrlMutation.mutate({ id: urlId ?? 0, body: data });
  };

  useEffect(() => {
    if (urlId) {
      console.log("refetch");

      getUrlQuery.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId]);

  useEffect(() => {
    console.log("setset");

    if (getUrlQuery.isSuccess && getUrlQuery.data) {
      console.log("set value");
      setValue("name", getUrlQuery.data.data.name);
    }
  }, [getUrlQuery.isSuccess, getUrlQuery.data, setValue]);

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
                        <button className="btn btn-warning btn-sm text-white" onClick={() => openModalUpdate(url.id)}>
                          change
                        </button>
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
              ""
            )}
          </div>
        </>
      )}

      {/* update url modal */}
      <dialog id="modal_update_url" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button onClick={closeModalUpdate} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-2xl font-semibold mx-auto text-center">Update url shortcut</p>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className={`input input-bordered ${errors.name?.message && "input-bordered input-error"}`}
                disabled={updateUrlMutation.isPending ? true : false}
                {...register("name")}
              />
              <div className="label">
                <span className="label-text-alt text-red-500">{errors?.name?.message}</span>
              </div>
            </div>

            <div className="form-control mt-6">
              <button
                className={`btn btn-primary ${
                  (updateUrlMutation.isPending || getUrlQuery.isLoading) && "btn-disabled"
                }`}
              >
                {updateUrlMutation.isPending && <span className="loading loading-spinner"></span>}
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* modal delete */}
      <dialog id="modal_delete" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <p className="py-4 text-xl">Are you sure you want to delete this data?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className={`btn ${deleteUrlMutation.isPending && "btn-disabled"}`}>Close</button>
            </form>
            <button
              onClick={() => deleteUrlMutation.mutate(urlForDelete ?? 0)}
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

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { create } from "../../service/url-service";
import { createUrlValidation } from "../../validation/url-validation";
import { formatZodErrors } from "../../utils/zodError";
import { useSearchParams } from "react-router-dom";

export default function CreateUrlModal() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const queryClient = useQueryClient();
  const modal = document.getElementById("modal_add_url") as HTMLDialogElement;
  const openModal = () => {
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    reset();
  };

  type createUrlType = z.infer<typeof createUrlValidation>;

  const createUrlMutation = useMutation({
    mutationFn: create,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["urls", page] });
      reset();
      modal.close();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.data?.errors) {
          const formattedErrors = formatZodErrors(error.response?.data);
          setError("name", formattedErrors.name);
          setError("redirectURL", formattedErrors.redirectURL);
        } else {
          const errorMessage = error.response?.data?.message || "An unknown error occurred";
          toast.error(errorMessage);
        }
      } else {
        console.log(error.message);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<createUrlType>({
    resolver: zodResolver(createUrlValidation),
  });
  const onSubmit: SubmitHandler<createUrlType> = (data) => {
    createUrlMutation.mutate(data);
    console.log(data);
  };

  return (
    <>
      <button
        className=" btn btn-sm btn-circle btn-ghost ml-auto border-gray-700 flex items-center justify-center my-5"
        onClick={openModal}
      >
        <FaPlus />
      </button>

      {/* create task modal */}
      <dialog id="modal_add_url" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-2xl font-semibold mx-auto text-center">Create url shortcut</p>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className={`input input-bordered ${errors.name?.message && "input-bordered input-error"}`}
                disabled={createUrlMutation.isPending ? true : false}
                {...register("name")}
              />
              <div className="label">
                <span className="label-text-alt text-red-500">{errors?.name?.message}</span>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Redirect url</span>
              </label>
              <input
                type="text"
                placeholder="https://www.google.com"
                className={`input input-bordered ${errors.redirectURL?.message && "input-bordered input-error"}`}
                disabled={createUrlMutation.isPending ? true : false}
                {...register("redirectURL")}
              />
              <div className="label">
                <span className="label-text-alt text-red-500">{errors?.redirectURL?.message}</span>
              </div>
            </div>

            <div className="form-control mt-6">
              <button className={`btn btn-primary ${createUrlMutation.isPending && "btn-disabled"}`}>
                {createUrlMutation.isPending && <span className="loading loading-spinner"></span>}
                Submit
              </button>{" "}
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

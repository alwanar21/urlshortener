import { z } from "zod";
import { PrivateInstance } from "./service";
import { createUrlValidation, updateUrlValidation } from "../validation/url-validation";

type CreateUrlType = z.infer<typeof createUrlValidation>;
type UpdateUrlType = z.infer<typeof updateUrlValidation>;

const getAll = async (page: string = "1") => {
  const result = await PrivateInstance(`/api/urls?page=${page}`);
  return result.data;
};

const get = async (id: number) => {
  const result = await PrivateInstance(`/api/url/${id}`);
  return result.data;
};

const create = async (body: CreateUrlType) => {
  const result = await PrivateInstance("/api/url", {
    method: "post",
    data: body,
  });
  return result.data;
};

const update = async (id: number, body: UpdateUrlType) => {
  const result = await PrivateInstance(`/api/url/${id}`, {
    method: "patch",
    data: body,
  });
  return result.data;
};

const updateStatus = async (id: number) => {
  const result = await PrivateInstance(`/api/url/${id}/status`, {
    method: "patch",
  });
  return result.data;
};

const remove = async (id: number) => {
  const result = await PrivateInstance(`/api/url/${id}`, {
    method: "delete",
  });
  return result.data;
};

export { getAll, get, create, update, updateStatus, remove };

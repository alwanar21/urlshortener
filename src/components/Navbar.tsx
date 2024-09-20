import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { Link, useNavigate } from "react-router-dom";

interface AuthUser {
  username: string;
}

export default function Navbar() {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const auth = useAuthUser<AuthUser>();

  const Out = () => {
    signOut();
    navigate("/");
  };

  const openModal = () => {
    const modal = document.getElementById("my_modal_5") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <>
      <div className="navbar bg-base-100 px-4 sticky top-0 shadow-sm">
        <div className="navbar-start">
          <Link to={"/dashboard"} className="font-bold text-xl">
            url shortener
          </Link>
        </div>
        <div className="navbar-end flex gap-2">
          <p className="text-base ">{auth?.username}</p>
          <button onClick={openModal} className="btn btn-error btn-sm text-white">
            Logout
          </button>
        </div>
      </div>

      {/* modal logout */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <p className="py-4 text-xl">Are you sure you want to log out?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
            <button onClick={Out} className="btn btn-error text-white">
              Logout
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

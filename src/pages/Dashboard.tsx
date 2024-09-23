import Navbar from "../components/Navbar";
import CreateUrlModal from "../components/urls/CreateUrlModal";
import Urls from "../components/urls/Urls";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-4">
        <CreateUrlModal />
        <Urls />
      </div>
    </>
  );
}

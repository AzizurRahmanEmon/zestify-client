import type { ChangeEvent } from "react";

interface ShopSearchFormProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const ShopSearchForm = ({ searchTerm, setSearchTerm }: ShopSearchFormProps) => {
  return (
    <form
      className="flex justify-between h-14 mt-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        className="bg-white w-[calc(100%-64px)] px-3 border border-[#DDDDDD] outline-none focus:border-zPink "
      />
      <button className="bg-zPink h-full w-16 flex items-center justify-center shrink-0 text-white text-lg">
        <i className="fa-light fa-magnifying-glass"></i>
      </button>
    </form>
  );
};

export default ShopSearchForm;

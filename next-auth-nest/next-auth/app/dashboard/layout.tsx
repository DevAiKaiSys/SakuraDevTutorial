import { auth } from "@/auth";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

const DashBoardLayout = async (props: Props) => {
  const session = await auth();

  return (
    <div className="flex">
      <div className="grid-cols-4 border-r shadow h-screen p-2">
        <Link
          className="p-3 rounded hover:bg-emerald-600 hover:text-white hover:shadow transition text-nowrap"
          href={`/dashboard/user/${session?.user?.id}`}
        >
          User Profile
        </Link>
      </div>
      <div className="w-full">{props.children}</div>
    </div>
  );
};

export default DashBoardLayout;

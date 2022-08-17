import Hero from '../componets/Hero/Hero'
import { Toaster } from "react-hot-toast";
import { useEagerConnect, useInactiveListener } from "../lib/hooks/web3Hook";

export default function Home() {
    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect();

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager);
  return (
    <div>
    <Toaster position="top-center" reverseOrder={false} />
    <Hero />
  </div>

  )
}

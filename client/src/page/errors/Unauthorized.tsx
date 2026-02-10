import { Link } from "react-router-dom";

const Unauthorized = () => {
  // return <div>Unauthorized</div>;

  return <div className=" " >

    <div className="min-h-screen flex items-center justify-center bg-[#eae7e4] text-black dark:bg-black dark:text-white overflow-hidden dark:bg-none">



      <div className="text-center px-6">

        {/* 401 */}
        <div className="flex justify-center">
          <span className="digit drop-1">4</span>
          <span className="digit drop-2">0</span>
          <span className="digit drop-3">1</span>
        </div>

        {/* Access Denied */}
        <h2 className="mt-7 text-2xl md:text-6xl font-bold tracking-tight fade-in">
         Unauthorized Access
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-xl mx-auto text-base md:text-lg opacity-70 fade-in delay-2">
          You don't have permission to access this page.
        </p>

        {/* Action */}
        <div className="mt-10 fade-in delay-3">
          <Link
            to="/"
            className="
              inline-flex items-center justify-center
              rounded-md border border-black dark:border-white
              px-8 py-3 text-lg font-medium
              transition-all
              hover:bg-black hover:text-white
              dark:hover:bg-white dark:hover:text-black
              hover:scale-[1.03]
              active:scale-[0.97]
            "
          >
            Go back home
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          .digit {
            font-size: clamp(7rem, 18vw, 14rem);
            font-weight: 800;
            line-height: 1;
            margin: 0 0.05em;
            transform: translateY(-120vh);
            animation: drop 0.8s ease-out forwards;
          }

          .drop-1 { animation-delay: 0.25s; }
          .drop-2 { animation-delay: 0.52s; }
          .drop-3 { animation-delay: 0.91s; }

          @keyframes drop {
            0% {
              transform: translateY(-120vh);
              opacity: 0;
            }
            70% {
              transform: translateY(10px);
              opacity: 1;
            }
            100% {
              transform: translateY(0);
            }
          }

          .fade-in {
            opacity: 0;
            animation: fadeIn 0.6s ease-out forwards;
            animation-delay: 1.2s;
          }

          .fade-in.delay-2 {
            animation-delay: 1.4s;
          }

          .fade-in.delay-3 {
            animation-delay: 1.6s;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>

  </div>
};

export default Unauthorized;

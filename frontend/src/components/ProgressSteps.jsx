const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex items-center space-x-2 sm:space-x-4 justify-between sm:justify-center w-full px-2">
      <div className={`${step1 ? "text-green-500" : "text-gray-300"}`}>
        <span className="ml-1 sm:ml-2 text-sm sm:text-base">Login</span>
        <div className="mt-2 text-base sm:text-lg text-center">✅</div>
      </div>

      {step2 && (
        <>
          {step1 && <div className="h-0.5 w-[2.5rem] sm:w-[10rem] bg-green-500"></div>}
          <div className={`${step1 ? "text-green-500" : "text-gray-300"}`}>
            <span className="text-sm sm:text-base">Shipping</span>
            <div className="mt-2 text-base sm:text-lg text-center">✅</div>
          </div>
        </>
      )}

      <>
        {step1 && step2 && step3 ? (
          <div className="h-0.5 w-[2.5rem] sm:w-[10rem] bg-green-500"></div>
        ) : (
          ""
        )}

        <div className={`${step3 ? "text-green-500" : "text-gray-300"}`}>
          <span className={`text-sm sm:text-base sm:ml-16`}>Summary</span>
          {step1 && step2 && step3 ? (
            <div className="mt-2 text-base sm:text-lg text-center">✅</div>
          ) : (
            ""
          )}
        </div>
      </>
    </div>
  );
};

export default ProgressSteps;

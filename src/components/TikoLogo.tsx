const TikoLogo = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-primary p-6 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary mb-1">Samsung</div>
          <div className="flex flex-col leading-none">
            <span className="text-6xl font-black text-accent">TIKO</span>
            <span className="text-6xl font-black text-accent">TIKO</span>
            <span className="text-6xl font-black text-accent">TIKO</span>
            <span className="text-6xl font-black text-secondary">TIKO</span>
          </div>
          <div className="text-xs text-secondary mt-2 font-medium">
            Powered by Iris • Open • Suite
          </div>
        </div>
      </div>
      <div className="mt-6 text-left max-w-xs">
        <p className="text-accent text-2xl font-semibold leading-tight">
          Your<br />
          ticket to<br />
          effortless<br />
          momentum
        </p>
      </div>
    </div>
  );
};

export default TikoLogo;

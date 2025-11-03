const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="progress-bordered"></div>
      <p className="text-[#256176] text-sm font-medium">
        Đang tải. Đợi xíu ...
      </p>
    </div>
  );
};

export default Loader;

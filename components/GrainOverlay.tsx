const GrainOverlay = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-[1] pointer-events-none overflow-hidden opacity-[0.06]"
    >
      <div className="grain-texture absolute inset-[-100%] animate-grain" />
    </div>
  );
};

export default GrainOverlay;

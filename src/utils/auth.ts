export const logout = () => {
  localStorage.removeItem("code");
  localStorage.removeItem("loginTime");
  // Dispatch custom event to notify App component of auth change
  window.dispatchEvent(new Event('auth-changed'));
  // Redirect to login page
  window.location.href = "/login";
};

export const getRemainingLoginTime = (): number => {
  const loginTime = localStorage.getItem("loginTime");
  if (!loginTime) return 0;
  
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  const currentTime = new Date().getTime();
  const storedLoginTime = parseInt(loginTime);
  const elapsed = currentTime - storedLoginTime;
  
  return Math.max(0, oneWeekInMs - elapsed);
};

export const formatRemainingTime = (ms: number): string => {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  
  if (days > 0) {
    return `${days} ngày ${hours} giờ`;
  } else if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  } else {
    return `${minutes} phút`;
  }
};

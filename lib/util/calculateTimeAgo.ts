/**
 * 受け取った日時から現在までの経過時間を返す関数。
 * 経過時間が1時間未満の場合は分単位、1日未満の場合は時間単位で表示し、
 * それ以上経過している場合は日付を"YYYY/MM/DD"形式で表示する。
 *
 * @param updatedTime - 経過時間を計算するための基準となる日時。
 * @returns 経過時間を文字列で返す。例えば、「Just now」「5 minutes ago」「3 hours ago」「2025/01/09」など。
 */
const calculateTimeAgo = (updatedTime: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - updatedTime.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInMinutes < 60) {
    return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const year = updatedTime.getFullYear();
    const month = String(updatedTime.getMonth() + 1).padStart(2, "0");
    const day = String(updatedTime.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
};

export default calculateTimeAgo;

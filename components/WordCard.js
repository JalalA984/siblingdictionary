const WordCard = ({ 
  word = "Unknown", 
  definition = "No definition provided", 
  synonyms = [], 
  dateAdded = "Unknown Date" 
}) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1; // Months are 0-based
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}/${year}`;
  };

  const formattedDate = dateAdded !== "Unknown Date" ? formatDate(dateAdded) : dateAdded;
  
  return (
    <div className="border rounded p-4 shadow">
      <h2 className="text-xl font-bold mb-2">{word}</h2>
      <p className="text-sm text-gray-700 mb-2">
        <strong>Definition:</strong> {definition}
      </p>
      <p className="text-sm text-gray-700 mb-2">
        <strong>Synonyms:</strong> {synonyms.length > 0 ? synonyms.join(", ") : "None"}
      </p>
      <p className="text-sm text-gray-500">
        <strong>Date Added:</strong> {formattedDate}
      </p>
    </div>
  );
};

export default WordCard;

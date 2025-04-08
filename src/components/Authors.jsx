import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useState } from "react";

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

const Authors = (props) => {
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [birthYear, setBirthYear] = useState("");
  
  const result = useQuery(ALL_AUTHORS);
  
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.error("Error updating author:", error);
    }
  });

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      await editAuthor({
        variables: {
          name: selectedAuthor,
          setBornTo: parseInt(birthYear)
        }
      });
      
      setSelectedAuthor("");
      setBirthYear("");
    } catch (error) {
      console.error("Error updating author:", error);
    }
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h3>Set birth year</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <select 
            value={selectedAuthor} 
            onChange={({ target }) => setSelectedAuthor(target.value)}
          >
            <option value="">Select an author</option>
            {authors.map(author => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="number"
            value={birthYear}
            onChange={({ target }) => setBirthYear(target.value)}
            placeholder="Birth year"
          />
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  );
};

export default Authors;

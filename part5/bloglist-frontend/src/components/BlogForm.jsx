const BlogForm = ({
  onSubmit,
  newTitle,
  newAuthor,
  newUrl,
  onTitleChange,
  onAuthorChange,
  onUrlChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        title
        <input type='text' value={newTitle} onChange={onTitleChange} />
      </div>
      <div>
        author
        <input type='text' value={newAuthor} onChange={onAuthorChange} />
      </div>
      <div>
        url
        <input type='text' value={newUrl} onChange={onUrlChange} />
      </div>
      <button type='submit'>create</button>
    </form>
  )
}

export default BlogForm

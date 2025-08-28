const verifyemailtemplate = (name , url)=>{
    return `
    <p> Dear ${name} </p>
    <p> Thanks for registration </p>
    <a href = ${url}> verify </a>
    `
}

export default verifyemailtemplate
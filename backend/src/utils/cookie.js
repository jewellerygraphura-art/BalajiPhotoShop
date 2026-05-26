let Cookies = (res, tokenType, token, maxAge) => {
    res.cookie(tokenType, token, {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: maxAge,
    })
}

export default Cookies;
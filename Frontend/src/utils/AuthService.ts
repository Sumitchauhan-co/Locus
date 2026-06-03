export const handleOAuthProto = () => {
    const clientId = import.meta.env.VITE_PROTOAUTH_CLIENT_ID;

    const AUTH_SERVER_BASE_URL =
        import.meta.env.VITE_PROTOAUTH_SERVER_BASE_URL ||
        'http://localhost:3000';
    const authorizeEndpoint = `${AUTH_SERVER_BASE_URL}/o/authenticate`;

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: `${window.location.origin}`,
        response_type: 'code',
        scope: 'openid profile email',
        state: Math.random().toString(36).substring(7),
    });

    window.location.href = `${authorizeEndpoint}?${params.toString()}`;
};

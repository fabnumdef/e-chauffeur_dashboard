export default function ({ app: { $auth, $api, $axios } }) {
  if (!!window && !!JSON) {
    const TOKEN_STORAGE = `${$auth.options.token.prefix}${$auth.options.defaultStrategy}`;
    const TOKEN_PREFIX = `${$auth.strategies.local.options.tokenType} `;
    const autoRenew = () => {
      const [, payload] = $auth.$storage
        .getUniversal(TOKEN_STORAGE)
        .replace(TOKEN_PREFIX, '')
        .split('.');
      const { exp, iat } = JSON.parse(window.atob(payload));
      const cur = Math.floor(Date.now() / 1000);
      const duration = exp - iat;
      const renewTrigger = duration / 2;
      const expIn = exp - cur;
      if (expIn <= 0) {
        $auth.logout();
      } else if (expIn < renewTrigger) {
        $api.jwt.renewJWT()
          .then((jwt) => {
            $auth.$storage.setUniversal(TOKEN_STORAGE, `${TOKEN_PREFIX}${jwt}`);
            $axios.setHeader($auth.strategies.local.options.tokenName, `${TOKEN_PREFIX}${jwt}`);
          })
          .catch(() => { setTimeout(autoRenew, 60 * 1000); });
      } else {
        setTimeout(autoRenew, expIn - renewTrigger * 1000);
      }
    };

    if ($auth.loggedIn) {
      autoRenew();
    }

    $auth.$storage.watchState('loggedIn', (loggedIn) => {
      if (loggedIn) {
        autoRenew();
      }
    });
  }
}

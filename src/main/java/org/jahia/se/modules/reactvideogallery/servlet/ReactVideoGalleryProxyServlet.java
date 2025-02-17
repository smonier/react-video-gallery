package org.jahia.se.modules.reactvideogallery.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.jahia.bin.filters.AbstractServletFilter;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component(service = AbstractServletFilter.class, configurationPid = "org.jahia.se.modules.org.jahia.se.modules.servicenow.credentials")
public class ReactVideoGalleryProxyServlet extends AbstractServletFilter {

    private static final Logger logger = LoggerFactory.getLogger(ReactVideoGalleryProxyServlet.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private String clientId;
    private String clientSecret;
    private String tokenEndpoint;
    private String snowUsername;
    private String snowPassword;
    private String serviceNowIncidentsUrl;
    private String incidentCommentsUrl;
    private String serviceNowUrl;

    private final Map<String, String> tokenCache = new ConcurrentHashMap<>();

    @Activate
    public void activate(Map<String, Object> config) {
        // Log all configuration values
        config.forEach((key, value) -> {
            String safeValue = key.toLowerCase().contains("password") || key.toLowerCase().contains("secret")
                    ? "[PROTECTED]"
                    : String.valueOf(value);
            logger.info("Config Key: {}, Value: {}", key, safeValue);
        });

        // Validate and extract configuration values
        try {
            String apiSchema = getConfigValue(config, "serviceNow.apiSchema");
            String instance = getConfigValue(config, "serviceNow.instance");
            String domain = getConfigValue(config, "serviceNow.apiDomain");
            String apiEndPoint = getConfigValue(config, "serviceNow.apiEndPoint");
            String incidentCommentsApiEndPoint = getConfigValue(config, "serviceNow.incidentCommentsApiEndPoint");

            snowUsername = getConfigValue(config, "serviceNow.snowUsername");
            snowPassword = getConfigValue(config, "serviceNow.snowPassword");
            clientId = getConfigValue(config, "serviceNow.clientId");
            clientSecret = getConfigValue(config, "serviceNow.clientSecret");
            tokenEndpoint = String.format("%s://%s.%s/oauth_token.do", apiSchema, instance, domain);

            serviceNowUrl = String.format("%s://%s.%s", apiSchema, instance, domain);
            serviceNowIncidentsUrl = String.format("%s/%s", serviceNowUrl, apiEndPoint);
            incidentCommentsUrl = String.format("%s/%s", serviceNowUrl, incidentCommentsApiEndPoint);

            logger.info("Activated ServiceNowProxyServlet with serviceNowUrl: {} and tokenEndpoint: {}", serviceNowUrl, tokenEndpoint);

            setUrlPatterns(new String[]{"/servicenow/*"});
        } catch (IllegalArgumentException e) {
            logger.error("ServiceNowProxyServlet activation failed: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Retrieves a configuration value as a string, with validation.
     *
     * @param config The configuration map.
     * @param key    The configuration key.
     * @return The configuration value as a string.
     * @throws IllegalArgumentException if the key is missing or the value is null.
     */
    private String getConfigValue(Map<String, Object> config, String key) {
        Object value = config.get(key);
        if (value == null) {
            throw new IllegalArgumentException("Missing required configuration key: " + key);
        }
        return String.valueOf(value);
    }

    /**
     * Validates the configuration map for required keys.
     *
     * @param config The configuration map to validate.
     */
    private void validateConfig(Map<String, String> config) {
        validateKey(config, "serviceNow.apiSchema");
        validateKey(config, "serviceNow.instance");
        validateKey(config, "serviceNow.apiDomain");
        validateKey(config, "serviceNow.apiEndPoint");
        validateKey(config, "serviceNow.snowUsername");
        validateKey(config, "serviceNow.snowPassword");
        validateKey(config, "serviceNow.clientId");
        validateKey(config, "serviceNow.clientSecret");
    }

    /**
     * Validates a single key in the configuration map.
     *
     * @param config The configuration map.
     * @param key    The key to validate.
     */
    private void validateKey(Map<String, String> config, String key) {
        if (!config.containsKey(key) || config.get(key) == null || config.get(key).isEmpty()) {
            throw new IllegalArgumentException(String.format("Missing or empty configuration key: %s", key));
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {
        logger.debug("Initializing ServiceNowProxyServlet with FilterConfig: {}", filterConfig);
    }

    @Override
    public void destroy() {
        logger.debug("Destroying ServiceNowProxyServlet");
    }


    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String method = request.getMethod();
        logger.info("Received {} request to URL: {}", method, request.getRequestURL());
        logger.info("Request Locale: {}", request.getLocale());
        logger.info("Accept-Language Header: {}", request.getHeader("Accept-Language"));
        switch (method.toUpperCase()) {
            case "POST":
                handleRequest(request, response, "POST");
                break;
            case "GET":
                handleRequest(request, response, "GET");
                break;
            default:
                logger.warn("Unsupported HTTP method: {}", method);
                response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED, "Method not supported");
        }
    }

    private void handleRequest(HttpServletRequest request, HttpServletResponse response, String method) throws IOException {
        String targetUrl = serviceNowUrl + request.getRequestURI().replace("/servicenow", "");
        //String targetUrl = serviceNowIncidentsUrl;
        if ("GET".equalsIgnoreCase(method) && request.getQueryString() != null) {
            targetUrl += "?" + request.getQueryString();
        }

        logger.info("Final constructed URL for {} request: {}", method, targetUrl);
        String accessToken = getAccessToken();
        HttpURLConnection connection = createConnection(new URL(targetUrl), method, accessToken);

        if ("POST".equalsIgnoreCase(method)) {
            String requestBody = IOUtils.toString(request.getReader());
            logger.info("Request Body for POST: {}", requestBody);
            try (OutputStream os = connection.getOutputStream()) {
                os.write(requestBody.getBytes(StandardCharsets.UTF_8));
            }
        }

        handleResponse(response, connection);
    }

    private HttpURLConnection createConnection(URL url, String method, String accessToken) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod(method);
        connection.setRequestProperty("Authorization", "Bearer " + accessToken);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("Accept", "application/json");
        connection.setRequestProperty("Accept-Language", "en");
        if ("POST".equalsIgnoreCase(method)) {
            connection.setDoOutput(true);
        }
        return connection;
    }

    private void handleResponse(HttpServletResponse response, HttpURLConnection connection) throws IOException {
        int status = connection.getResponseCode();
        response.setStatus(status);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        logger.info("Response Status Code: {}", status);

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(status >= 400 ? connection.getErrorStream() : connection.getInputStream(), StandardCharsets.UTF_8))) {
            String responseBody = IOUtils.toString(reader);
            logger.info("ServiceNow API Response Body: {}", responseBody);
            response.getWriter().write(responseBody);
        } catch (IOException e) {
            logger.error("Error reading ServiceNow API response", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error reading ServiceNow API response");
        }
    }

    private String getAccessToken() throws IOException {
        // Check token cache
        String cachedToken = tokenCache.get("accessToken");
        if (cachedToken != null) {
            logger.info("Using cached access token.");
            return cachedToken;
        }

        // Log token generation
        logger.info("Generating new access token via proxy...");
        logger.info("{} - {} - {} - {}", clientId, clientSecret, snowUsername, snowPassword);

        // Open connection to token endpoint
        HttpURLConnection connection = (HttpURLConnection) new URL(tokenEndpoint).openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        connection.setDoOutput(true);

        // Prepare request body
        String requestBody = String.format(
                "grant_type=password&client_id=%s&client_secret=%s&username=%s&password=%s",
                URLEncoder.encode(clientId, StandardCharsets.UTF_8),
                URLEncoder.encode(clientSecret, StandardCharsets.UTF_8),
                URLEncoder.encode(snowUsername, StandardCharsets.UTF_8),
                URLEncoder.encode(snowPassword, StandardCharsets.UTF_8)
        );

        try (OutputStream os = connection.getOutputStream()) {
            os.write(requestBody.getBytes(StandardCharsets.UTF_8));
        }

        // Handle response
        int status = connection.getResponseCode();
        String responseBody = new String(connection.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        if (status >= 400) {
            logger.error("Failed to generate token. Response code: {}, Response: {}", status, responseBody);
            throw new IOException("Failed to generate access token. HTTP status: " + status + ". Error: " + responseBody);
        }

        // Detect HTML response indicating hibernation
        if (responseBody.startsWith("<html>")) {
            logger.error("ServiceNow instance is hibernating. Please wake up the instance.");
            throw new IOException("ServiceNow instance is hibernating. Wake it up at https://developer.servicenow.com");
        }

        // Parse JSON response
        Map<String, Object> responseMap = objectMapper.readValue(responseBody, Map.class);
        String accessToken = (String) responseMap.get("access_token");
        Integer expiresIn = (Integer) responseMap.get("expires_in");

        if (accessToken == null || expiresIn == null) {
            logger.error("Access token or expiry time missing in response: {}", responseBody);
            throw new IOException("Invalid token response received from proxy.");
        }

        // Cache the token with expiry
        cacheToken(accessToken, expiresIn);

        return accessToken;
    }

    /**
     * Caches the token and sets an expiry mechanism.
     * @param accessToken The token to cache.
     * @param expiresIn The token's validity period in seconds.
     */
    private void cacheToken(String accessToken, int expiresIn) {
        tokenCache.put("accessToken", accessToken);

        // Schedule token expiration 1 minute before it actually expires
        new Thread(() -> {
            try {
                Thread.sleep((expiresIn - 60L) * 1000);
                tokenCache.remove("accessToken");
                logger.info("Access token expired and removed from cache.");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                logger.error("Token cache expiry thread interrupted.", e);
            }
        }).start();
    }
}
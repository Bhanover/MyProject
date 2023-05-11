package com.myserver.myserver.security.jwt;


import com.myserver.myserver.exception.InvalidJwtException;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
  @Value("${billy.app.jwtSecret}")
  private String jwtSecret;

  @Value("${billy.app.jwtExpirationMs}")
  private int jwtExpirationMs;

  public String getUsernameFromToken(String token) {
    return Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
  }
  public String getTokenFromRequest(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7);
    }
    return null;
  }
  public boolean validateToken(String token) throws InvalidJwtException {
    try {
      final String username = getUsernameFromToken(token);
      Jwts.parser()
              .setSigningKey(jwtSecret)
              .parseClaimsJws(token);
      return true;
    } catch (ExpiredJwtException e) {
      throw new InvalidJwtException("El token ha expirado");
    } catch (JwtException e) {
      throw new InvalidJwtException("Token de autenticación no válido");
    }
  }
  public void invalidateToken(String token) {
    Claims claims = Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody();
    Date expirationDate = claims.getExpiration();
    Map<String, Object> updatedClaims = new HashMap<>();
    updatedClaims.putAll(claims);
    updatedClaims.put("exp", new Date(System.currentTimeMillis() - 1000));
    Jwts.builder()
            .setClaims(updatedClaims)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
  }
  private boolean isTokenExpired(String token) {
    final Date expiration = getExpirationDateFromToken(token);
    return expiration.before(new Date());
  }

  private Date getExpirationDateFromToken(String token) {
    return Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody()
            .getExpiration();
  }
  public String generateTokenFromUsername(String username) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

    Map<String, Object> claims = new HashMap<>();
    claims.put("sub", username);
    claims.put("iat", now);
    claims.put("exp", expiryDate);

    String token = Jwts.builder()
            .setClaims(claims)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();

    System.out.println("Generated JWT token: " + token); // esta línea para imprimir el token

    return token;
  }

}

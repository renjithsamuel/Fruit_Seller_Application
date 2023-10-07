package grpcServer

import (
	"context"
	"errors"
	"fmt"
	tokenGrpcService "proto/userTokenProto"
	"time"

	"github.com/dgrijalva/jwt-go"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// validate token functions
func (th *GrpcAuthServer) VerifyToken(ctx context.Context, req *tokenGrpcService.VerifyTokenRequest) (*tokenGrpcService.VerifyTokenResponse, error) {
	token := req.Token
	// fmt.Println(token)
	if token == "" {
		fmt.Println("[Validation Failed] : Token Required")
		return &tokenGrpcService.VerifyTokenResponse{
			UserID:  "",
			Success: false,
			Message: "Token Required",
		}, status.Error(codes.InvalidArgument, "Token not found")
	}

	// Validate the token
	userID, err := VerifyToken(token, th.secretKey)
	if err != nil {
		fmt.Printf("[Validation Failed] : ,%v\n", err.Error())
		return &tokenGrpcService.VerifyTokenResponse{
			UserID:  "",
			Success: false,
			Message: err.Error(),
		}, status.Error(codes.PermissionDenied, "Validation Failed : "+err.Error())
	}

	return &tokenGrpcService.VerifyTokenResponse{
		UserID:  userID,
		Success: true,
		Message: "User Authorized",
	}, nil
}

func VerifyToken(tokenString string, secretKey string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		secretKeyByte := []byte(secretKey)
		return secretKeyByte, nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID, ok := claims["sub"].(string)
		if !ok {
			return "", fmt.Errorf("sub claim is not a string")
		}
		return userID, nil
	}

	return "", errors.New("invalid token")
}

// generate token functions
func (th *GrpcAuthServer) GenerateToken(ctx context.Context, req *tokenGrpcService.GenerateTokenRequest) (*tokenGrpcService.GenerateTokenResponse, error) {
	userID := req.UserID
	// fmt.Println(th.secretKey)
	// fmt.Println(userID)

	if userID == "" {
		fmt.Println("[Generation Failed] : User ID required")
		return &tokenGrpcService.GenerateTokenResponse{
			Token:   "",
			Success: false,
			Message: "UserID required",
		}, status.Errorf(codes.InvalidArgument, "[Invalid request] : token not found")
	}

	token, err := GenerateToken(userID, th.secretKey)
	if err != nil {
		fmt.Printf("[Generation Failed] : Internal server error,%v\n", err.Error())
		return &tokenGrpcService.GenerateTokenResponse{
			Token:   "",
			Success: true,
			Message: "internal server error",
		}, status.Errorf(codes.Internal, "[Generation Failed]: %v", err.Error())
	}

	return &tokenGrpcService.GenerateTokenResponse{
		Token:   token,
		Success: true,
		Message: "User Authorized",
	}, nil
}

func GenerateToken(userID string, secretKey string) (string, error) {
	tokenClaims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
		"iat": time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenClaims)
	secretKeyByte := []byte(secretKey)
	signedToken, err := token.SignedString(secretKeyByte)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

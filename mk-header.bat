chcp 65001
@echo off
setlocal enabledelayedexpansion
SET MY_FOLDER=%~dp0
SET ZEN_DIR=zenn_header
SET CLAAT_DIR=claat_header

REM get Parameter

IF "%~1"=="" (
  ECHO Please specify the articles name and Service name.
  ECHO e.g. mk-header.bat route53 "AWS Route53"
  EXIT /B 1
) ELSE (
  SET ARTICLE_NAME=%~1
)
IF "%~2"=="" (
  ECHO Please specify the articles name and Service name.
  ECHO e.g. mk-header.bat route53 "AWS Route53"
  EXIT /B 1
) ELSE (
  SET SERVICE_NAME=%~2
)

echo.
echo ============================
echo ARTICLE_NAME: %ARTICLE_NAME%
echo SERVICE_NAME: %SERVICE_NAME%
echo ============================
echo.

SET ARTICLE_FULLNAME=%ARTICLE_NAME%-overview.md
SET LF=^


REM SEARCH ZENN HEADER
REM ---
REM title: "Amazon Route 53 入門！完全ガイド" # 記事のタイトル
REM type: "tech" # tech: 技術記事 / idea: アイデア記事
REM topics: ["aws", "study"]
REM published: true
REM ---


IF EXIST %MY_FOLDER%%ZEN_DIR%\%ARTICLE_FULLNAME% (
  ECHO Zenn header found: %MY_FOLDER%%ZEN_DIR%\%ARTICLE_FULLNAME%
) ELSE (
  ECHO Zenn header not found: %MY_FOLDER%%ZEN_DIR%\%ARTICLE_FULLNAME%
  ECHO ---!LF!title: "%SERVICE_NAME% 入門！完全ガイド" # 記事のタイトル!LF!type: "tech" # tech: 技術記事 / idea: アイデア記事!LF!topics: ["aws", "study"]!LF!published: false!LF!--- >> %MY_FOLDER%%ZEN_DIR%\%ARTICLE_FULLNAME%
)

REM SEARCH CLAAT HEADER
REM summary: Summary
REM id: sns-overview
REM categories: AWS
REM tags: Amazon SNS
REM status: Published
REM authors: ishr
REM Feedback Link: 
IF EXIST %MY_FOLDER%%CLAAT_DIR%\%ARTICLE_FULLNAME% (
  ECHO Zenn header found: %MY_FOLDER%%CLAAT_DIR%\%ARTICLE_FULLNAME%
) ELSE (
  ECHO CLAAT header not found: %MY_FOLDER%%CLAAT_DIR%\%ARTICLE_FULLNAME%
  ECHO summary: Summary!LF!id: %ARTICLE_NAME%-overview!LF!categories: AWS!LF!tags: %SERVICE_NAME%!LF!status: Published!LF!authors: ishr!LF!Feedback Link:  >> %MY_FOLDER%%CLAAT_DIR%\%ARTICLE_FULLNAME%
)

exit /b 0

<!DOCTYPE html>
<html>
<head>
    <title>Puissance 4</title>
    <meta charset="utf-8">
</head>
<body>
    <div class="p4" style="margin: auto;"></div>
    <script src="public/script/jquery-3.2.1.js"></script>
    <script src="public/script/puissance4.js"></script>
    <script>
        $(function () {
            $(".p4").puissance4({
                "dimensions": [1, 1],
                "colors": ["#333300", "#8B0000"]
            });
        })
    </script>
</body>
</html>
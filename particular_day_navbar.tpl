<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <title>{{particular_day_title}}</title>
    <!-- Latest compiled and minified JavaScript -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
    <style>
        .hoverable {
            height: 20px;
            width: 250px;
            overflow: hidden;
        }
        .hoverable:hover {
            position: absolute;
            transform: translateX(-75%) translateY(-50%);
            height: auto;
            width: 45%;
            overflow-y: auto;
            background-color: white;
            border: 1px solid #777;
            padding: 8px;
            border-radius: 4px;
            box-shadow: 0 0 4px #555;
            box-sizing: border-box;
        }
        .table-responsive {
            min-height: .01%;
            overflow-x: auto;
        }
        table {
            border: none;
            border-collapse: collapse;
            text-align:left;
            padding: 10px;
            margin-bottom: 40px;
            font-size: 0.9em;
        }

        table th {
            text-align: left;
        }

        .first-bold tr td:first-child{
            font-weight: bold;
        }
        .embed-responsive {
            height: calc(100vh - 64px)!important;
        }


    </style>
</head>
<body>

<div class="container-fluid">
    <div class="row">
        <div class="col-md-12" style="padding: 0">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">

                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="navbar-toggler-icon"></span>
                </button> <a class="navbar-brand" href="#" id="{{ xday }}" onclick="detail_view(this.id)">Detail</a>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

                    {#  HERE COMES DROPDOWN MENU -START #}

                    <ul class="navbar-nav ml-md-auto">
{#                        <li class="nav-item">#}
{#                            <a class="nav-link" href="#">Link <span class="sr-only">(current)</span></a>#}
{#                        </li>#}
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown">
                                ___ Detailed rotation menu ___
                            </a>
                            <div class="dropdown-menu dropdown-menu-left" aria-labelledby="navbarDropdownMenuLink">
                                {% for _reg in unique_reg %}
                                    <a class="dropdown-item" href="#" id="{{ xday }}/{{_reg}}" onclick="reg_click(this.id)">{{_reg}}</a>
                                {% endfor %}
                            </div>
                        </li>
                    </ul>

                    {#  HERE COMES DROPDOWN MENU - END #}
{#                    <ul class="navbar-nav pagination">#}
{#                        {% for _reg in unique_reg %}#}
{#                            <li class="nav-item page-item">#}
{#                                <a class="nav-link" href="#" id="{{ xday }}/{{_reg}}" onclick="reg_click(this.id)">{{_reg}}</a>#}
{#                            </li>#}
{#                        {% endfor %}#}
{##}
{#                    </ul>#}

                </div>
            </nav>

            <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" id="particular_day_nav" src="/detail/{{ xday }}" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    </div>
</div>

<script>
    const iframe = document.querySelector('iframe');
    function reg_click(_regg)
    {
        iframe.src = '/reg/' + _regg;
    }

    function detail_view(id_file_name) {
        iframe.src = '/detail/' + id_file_name;
    }
</script>

</body>
</html>
